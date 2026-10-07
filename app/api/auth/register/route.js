import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password, confirmPassword, phone } = body;

    // 1. Validate fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide full name, email, and password.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Validate confirmation if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // 2. Rate limiting on registration attempts
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';
    const rateLimitResult = await checkRateLimit(`register:${clientIp}`, {
      limit: 10,
      windowSeconds: 15 * 60
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // 3. Connect to Database
    const db = await connectDB();
    let userId;

    // Securely hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (db && mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });

      if (existingUser) {
        if (existingUser.emailVerified) {
          return NextResponse.json(
            { success: false, message: 'An account with this email already exists. Please sign in.' },
            { status: 400 }
          );
        }

        // Existing unverified account: update credentials and reset verification
        existingUser.fullName = cleanName;
        existingUser.passwordHash = passwordHash;
        if (phone) existingUser.phone = phone.trim();
        existingUser.emailVerified = false;
        existingUser.emailVerifiedAt = null;
        await existingUser.save();
        userId = existingUser._id;
      } else {
        // Create new unverified user
        const newUser = await User.create({
          fullName: cleanName,
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          phone: phone ? phone.trim() : '',
          role: 'customer',
          emailVerified: false,
          emailVerifiedAt: null
        });
        userId = newUser._id;
      }
    } else {
      // Memory Store Fallback for dev / offline
      const memoryUsers = global.memoryUsers || [];
      const existingUser = memoryUsers.find(u => u.email === cleanEmail);

      if (existingUser && existingUser.emailVerified) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists. Please sign in.' },
          { status: 400 }
        );
      }

      if (existingUser) {
        existingUser.name = cleanName;
        existingUser.fullName = cleanName;
        existingUser.password = password;
        existingUser.passwordHash = passwordHash;
        existingUser.phone = phone ? phone.trim() : '';
        existingUser.emailVerified = false;
        existingUser.emailVerifiedAt = null;
        userId = existingUser._id;
      } else {
        userId = 'm_' + Date.now();
        memoryUsers.push({
          _id: userId,
          name: cleanName,
          fullName: cleanName,
          email: cleanEmail,
          password,
          passwordHash,
          role: 'customer',
          phone: phone ? phone.trim() : '',
          emailVerified: false,
          emailVerifiedAt: null,
          addresses: []
        });
      }
      global.memoryUsers = memoryUsers;
    }

    // 4. Generate cryptographically secure 6-digit OTP (10 MINUTES / 600s expiration)
    const { code: otpCode } = await createOtp({
      userId,
      email: cleanEmail,
      purpose: 'EMAIL_VERIFICATION',
      expirationSeconds: 600
    });

    // 5. Send real email via Resend / Gmail SMTP
    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      userName: cleanName,
      otpCode,
      purpose: 'EMAIL_VERIFICATION'
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResult.error || "We couldn't send the verification email right now. Please try again."
        },
        { status: 500 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      requireVerification: true,
      email: cleanEmail,
      expiresIn: 600,
      devOtp: (process.env.NODE_ENV !== 'production' || emailResult.simulated) ? otpCode : undefined,
      message: emailResult.simulated
        ? `Verification code: ${otpCode} (also logged in server console).`
        : emailResult.routedTo
          ? `A 6-digit verification code has been dispatched to your inbox (${emailResult.routedTo}).`
          : `A 6-digit verification code has been sent to ${cleanEmail}.`
    });

  } catch (error) {
    console.error('Registration API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
