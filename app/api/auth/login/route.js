import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate limiting on login attempts (protect against brute force)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';
    const rateLimit = await checkRateLimit(`login:${cleanEmail}:${clientIp}`, {
      limit: 10,
      windowSeconds: 15 * 60
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Connect to database
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
        { success: false, message: 'No account found with this email. Please register.' },
        { status: 404 }
      );
    }

    // 3. Verify password
    let isMatch = false;
    if (user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } else if (user.password) {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    // Check account status
    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended. Please contact support.' },
        { status: 403 }
      );
    }

    // 4. Check email verification status (Master Prompt Section 12 & 22)
    // If account is unverified: block dashboard, dispatch fresh 60s OTP code, and require verification
    const isVerified = user.emailVerified === true || user.role === 'admin';

    if (!isVerified) {
      const userName = user.fullName || user.name || 'Customer';

      const { code: otpCode } = await createOtp({
        userId: user._id,
        email: cleanEmail,
        purpose: 'EMAIL_VERIFICATION',
        expirationSeconds: 600
      });

      // Send real email via Resend / Gmail SMTP
      const emailResult = await sendOtpEmail({
        toEmail: cleanEmail,
        userName,
        otpCode,
        purpose: 'EMAIL_VERIFICATION'
      });

      return NextResponse.json(
        {
          success: false,
          requireVerification: true,
          email: cleanEmail,
          purpose: 'EMAIL_VERIFICATION',
          expiresIn: 600,
          devOtp: (process.env.NODE_ENV !== 'production' || emailResult.simulated) ? otpCode : undefined,
          message: emailResult.routedTo
            ? `Your email address is not verified. We've sent a 6-digit verification code to your inbox (${emailResult.routedTo}).`
            : "Your email address is not verified. We've sent a new 6-digit verification code to your email."
        },
        { status: 403 }
      );
    }

    // 5. Successful login: Generate JWT token with emailVerified: true
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
        phone: user.phone || '',
        emailVerified: true,
        addresses: user.addresses || []
      }
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

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed.' },
      { status: 500 }
    );
  }
}
