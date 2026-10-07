import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyOtp } from '@/lib/otp';
import { generateToken } from '@/lib/jwt';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const RESET_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'kick_home_care_reset_secret_2026';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp, purpose = 'EMAIL_VERIFICATION' } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and 6-digit verification code.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Verify OTP using our cryptographically secure OTP engine
    const result = await verifyOtp({
      email: cleanEmail,
      code: cleanOtp,
      purpose
    });

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          expired: result.expired || false,
          maxAttemptsReached: result.maxAttemptsReached || false,
          message: result.message
        },
        { status: 400 }
      );
    }

    // Connect to database to retrieve and update user
    const db = await connectDB();
    let user;

    if (db && mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      const memoryUsers = global.memoryUsers || [];
      user = memoryUsers.find(u => u.email === cleanEmail);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User account not found.' },
        { status: 404 }
      );
    }

    // Handle Purpose: EMAIL_VERIFICATION or LOGIN_VERIFICATION
    if (purpose === 'EMAIL_VERIFICATION' || purpose === 'LOGIN_VERIFICATION') {
      if (db && mongoose.connection.readyState === 1) {
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        user.verificationCodeHash = null;
        user.verificationCodeExpiresAt = null;
        user.verificationAttempts = 0;
        await user.save();
      } else {
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        user.verificationCodeHash = null;
        user.verificationCodeExpiresAt = null;
      }

      // Generate full JWT authentication session token
      const token = generateToken({
        id: user._id,
        role: user.role || 'customer',
        emailVerified: true
      });

      const response = NextResponse.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.fullName || user.name,
          email: user.email,
          role: user.role || 'customer',
          emailVerified: true,
          phone: user.phone || ''
        },
        message: 'Email verified successfully! You are now logged in.'
      });

      // Set secure HTTP-only cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });

      return response;
    }

    // Handle Purpose: PASSWORD_RESET
    if (purpose === 'PASSWORD_RESET') {
      // Issue a short-lived reset token (valid for 10 minutes) allowing password change
      const resetToken = jwt.sign(
        { userId: user._id, email: cleanEmail, purpose: 'PASSWORD_RESET_AUTHORIZED' },
        RESET_SECRET,
        { expiresIn: '10m' }
      );

      return NextResponse.json({
        success: true,
        verified: true,
        resetToken,
        message: 'Verification code confirmed. You may now create your new password.'
      });
    }

    return NextResponse.json({ success: true, message: 'Verified successfully.' });

  } catch (error) {
    console.error('Verify OTP API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
