import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide administrator email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate Limiting: 60-second cooldown
    const cooldownKey = `cooldown:ADMIN_EMAIL_VERIFICATION:${cleanEmail}`;
    const cooldownCheck = await checkRateLimit(cooldownKey, { limit: 1, windowSeconds: 60 });
    if (!cooldownCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          cooldown: true,
          retryAfter: cooldownCheck.retryAfterSeconds,
          message: `Please wait ${cooldownCheck.retryAfterSeconds} seconds before requesting a new code.`
        },
        { status: 429 }
      );
    }

    // Rate limiting: max 5 requests per 15 minutes
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';
    const windowKey = `resend:ADMIN_EMAIL_VERIFICATION:${cleanEmail}:${clientIp}`;
    const windowCheck = await checkRateLimit(windowKey, { limit: 5, windowSeconds: 15 * 60 });
    if (!windowCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          rateLimited: true,
          message: 'Too many verification code requests. Please wait 15 minutes before trying again.'
        },
        { status: 429 }
      );
    }

    // 2. Database Lookup
    const db = await connectDB();
    let user = null;

    if (db && mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      const memoryUsers = global.memoryUsers || [];
      user = memoryUsers.find(u => u.email === cleanEmail);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No administrator account found with this email.' },
        { status: 404 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Account is not registered as an administrator.' },
        { status: 403 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'This administrator account is already verified. Please log in directly.' },
        { status: 400 }
      );
    }

    // 3. Generate New 10-Minute Secure OTP
    const { code: otpCode } = await createOtp({
      userId: user._id,
      email: cleanEmail,
      purpose: 'ADMIN_EMAIL_VERIFICATION',
      expirationSeconds: 600
    });

    // 4. Send Branded Admin Verification Email
    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      userName: user.fullName || user.name || 'Admin',
      otpCode,
      purpose: 'ADMIN_EMAIL_VERIFICATION'
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResult.error || "Unable to send verification email. Please verify mail server settings."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresIn: 600,
      devOtp: (process.env.NODE_ENV !== 'production' || emailResult.simulated) ? otpCode : undefined,
      message: emailResult.simulated
        ? `Verification code: ${otpCode} (also logged in server console).`
        : emailResult.routedTo
          ? `A fresh 6-digit verification code has been dispatched to your inbox (${emailResult.routedTo}).`
          : `A new 6-digit verification code has been sent to ${cleanEmail}.`
    });
  } catch (error) {
    console.error('Admin Resend OTP API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resend code. Please try again.' },
      { status: 500 }
    );
  }
}
