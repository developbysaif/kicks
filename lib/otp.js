import crypto from 'crypto';
import mongoose from 'mongoose';
import connectDB from './db.js';
import User from '../models/User.js';
import VerificationOtp from '../models/VerificationOtp.js';

// In-memory fallback store for offline/simulation mode
const memoryOtps = global.__memoryOtps || [];
global.__memoryOtps = memoryOtps;

/**
 * Generates a cryptographically secure 6-digit random numeric OTP code
 */
export function generateNumericOtp() {
  // Generates integer between 100000 and 999999 inclusive
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes SHA-256 hash of an OTP code
 */
export function hashOtp(code) {
  return crypto.createHash('sha256').update(String(code).trim()).digest('hex');
}

/**
 * Creates and stores a new OTP for a user and purpose
 * Defaults to 600 SECONDS (10 minutes) expiration
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.email
 * @param {string} params.purpose 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'LOGIN_VERIFICATION' | 'ADMIN_EMAIL_VERIFICATION'
 * @param {number} params.expirationSeconds Default 600 seconds (10 minutes)
 * @returns {Promise<{ code: string, expiresAt: Date }>}
 */
export async function createOtp({ userId, email, purpose = 'EMAIL_VERIFICATION', expirationSeconds = 600 }) {
  const cleanEmail = email.trim().toLowerCase();
  const code = generateNumericOtp();
  const otpHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + expirationSeconds * 1000);

  const db = await connectDB();

  if (db && mongoose.connection.readyState === 1) {
    // 1. Invalidate any existing unused OTPs for this email and purpose
    await VerificationOtp.updateMany(
      { email: cleanEmail, purpose, isUsed: false },
      { $set: { isUsed: true, usedAt: new Date() } }
    );

    // 2. Create the new OTP record
    await VerificationOtp.create({
      userId,
      email: cleanEmail,
      purpose,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      isUsed: false
    });

    // 3. Mirror on User document for fast dual lookups
    const userUpdate = {};
    if (purpose === 'EMAIL_VERIFICATION' || purpose === 'LOGIN_VERIFICATION' || purpose === 'ADMIN_EMAIL_VERIFICATION') {
      userUpdate.verificationCodeHash = otpHash;
      userUpdate.verificationCodeExpiresAt = expiresAt;
      userUpdate.verificationAttempts = 0;
      userUpdate.emailVerificationLastSentAt = new Date();
    } else if (purpose === 'PASSWORD_RESET') {
      userUpdate.resetCodeHash = otpHash;
      userUpdate.resetCodeExpiresAt = expiresAt;
      userUpdate.resetAttempts = 0;
    }
    if (Object.keys(userUpdate).length > 0) {
      await User.updateOne({ _id: userId }, { $set: userUpdate });
    }
  } else {
    // Memory store fallback
    // Invalidate old
    global.__memoryOtps = (global.__memoryOtps || []).filter(
      item => !(item.email === cleanEmail && item.purpose === purpose && !item.isUsed)
    );

    global.__memoryOtps.push({
      userId: String(userId),
      email: cleanEmail,
      purpose,
      otpHash,
      code, // only stored in memory fallback for dev/testing
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      isUsed: false,
      createdAt: new Date()
    });
  }

  return { code, expiresAt };
}

/**
 * Validates a submitted OTP code
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.code 6-digit numeric string
 * @param {string} params.purpose 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'LOGIN_VERIFICATION'
 * @returns {Promise<{ valid: boolean, message: string, expired?: boolean, maxAttemptsReached?: boolean, userId?: string, email?: string }>}
 */
export async function verifyOtp({ email, code, purpose = 'EMAIL_VERIFICATION' }) {
  if (!email || !code) {
    return { valid: false, message: 'Please provide email and verification code.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = String(code).trim();

  // Validate 6 digits
  if (!/^\d{6}$/.test(cleanCode)) {
    return { valid: false, message: 'Please enter a valid 6-digit numeric code.' };
  }

  const submittedHash = hashOtp(cleanCode);
  const now = new Date();
  const db = await connectDB();

  if (db && mongoose.connection.readyState === 1) {
    // Find latest OTP record for this email & purpose
    const otpDoc = await VerificationOtp.findOne({
      email: cleanEmail,
      purpose
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return {
        valid: false,
        message: 'No active verification code found. Please request a new code.'
      };
    }

    // Check if previously marked as used or locked out
    if (otpDoc.isUsed) {
      if (otpDoc.attempts >= otpDoc.maxAttempts) {
        return {
          valid: false,
          maxAttemptsReached: true,
          message: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.'
        };
      }
      return {
        valid: false,
        message: 'This verification code has already been used. Please request a new code.'
      };
    }

    // Check expiration
    if (now > new Date(otpDoc.expiresAt)) {
      otpDoc.isUsed = true;
      await otpDoc.save();
      return {
        valid: false,
        expired: true,
        message: 'This verification code has expired. Please request a new one.'
      };
    }

    // Check attempt limits
    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      otpDoc.isUsed = true;
      await otpDoc.save();
      return {
        valid: false,
        maxAttemptsReached: true,
        message: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.'
      };
    }

    // Verify hash match
    if (otpDoc.otpHash !== submittedHash) {
      otpDoc.attempts += 1;
      const isMaxReached = otpDoc.attempts >= otpDoc.maxAttempts;
      if (isMaxReached) {
        otpDoc.isUsed = true;
      }
      await otpDoc.save();

      // Mirror to User model if present
      try {
        await User.updateOne(
          { email: cleanEmail },
          { $set: { verificationAttempts: otpDoc.attempts } }
        );
      } catch (err) {
        // silent
      }

      const remaining = Math.max(0, otpDoc.maxAttempts - otpDoc.attempts);
      return {
        valid: false,
        maxAttemptsReached: isMaxReached,
        attemptsRemaining: remaining,
        message: remaining > 0
          ? `Invalid verification code. (${remaining} attempts remaining)`
          : 'Maximum attempts exceeded. Please request a new code.'
      };
    }

    // SUCCESS: Mark as used
    otpDoc.isUsed = true;
    otpDoc.usedAt = now;
    await otpDoc.save();

    // Mirror to User model
    try {
      await User.updateOne(
        { email: cleanEmail },
        {
          $set: {
            verificationCodeHash: null,
            verificationCodeExpiresAt: null,
            verificationAttempts: 0
          }
        }
      );
    } catch (err) {
      // silent
    }

    return {
      valid: true,
      userId: otpDoc.userId,
      email: otpDoc.email,
      message: 'Verification successful.'
    };

  } else {
    // Memory Store Fallback
    const store = global.__memoryOtps || [];
    const otpDoc = store
      .filter(item => item.email === cleanEmail && item.purpose === purpose)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!otpDoc) {
      return {
        valid: false,
        message: 'No active verification code found. Please request a new code.'
      };
    }

    if (otpDoc.isUsed) {
      if (otpDoc.attempts >= otpDoc.maxAttempts) {
        return {
          valid: false,
          maxAttemptsReached: true,
          message: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.'
        };
      }
      return {
        valid: false,
        message: 'This verification code has already been used. Please request a new code.'
      };
    }

    if (now > new Date(otpDoc.expiresAt)) {
      otpDoc.isUsed = true;
      return {
        valid: false,
        expired: true,
        message: 'This verification code has expired. Please request a new one.'
      };
    }

    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      otpDoc.isUsed = true;
      return {
        valid: false,
        maxAttemptsReached: true,
        message: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.'
      };
    }

    if (otpDoc.otpHash !== submittedHash && otpDoc.code !== cleanCode) {
      otpDoc.attempts += 1;
      const isMaxReached = otpDoc.attempts >= otpDoc.maxAttempts;
      if (isMaxReached) {
        otpDoc.isUsed = true;
      }
      const remaining = Math.max(0, otpDoc.maxAttempts - otpDoc.attempts);
      return {
        valid: false,
        maxAttemptsReached: isMaxReached,
        attemptsRemaining: remaining,
        message: remaining > 0
          ? `Invalid verification code. (${remaining} attempts remaining)`
          : 'Maximum attempts exceeded. Please request a new code.'
      };
    }

    otpDoc.isUsed = true;
    otpDoc.usedAt = now;

    return {
      valid: true,
      userId: otpDoc.userId,
      email: otpDoc.email,
      message: 'Verification successful.'
    };
  }
}
