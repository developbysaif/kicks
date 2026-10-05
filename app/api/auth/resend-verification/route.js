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
        { success: false, message: 'Please provide email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Rate Limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    const cooldownCheck = await checkRateLimit(`cooldown:EMAIL_VERIFICATION:${cleanEmail}:${clientIp}`, {
      limit: 1,
      windowSeconds: 60
    });

    if (!cooldownCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          cooldown: true,
          retryAfter: cooldownCheck.retryAfterSeconds,
          message: `Please wait ${cooldownCheck.retryAfterSeconds}s before requesting a new code.`
        },
        { status: 429 }
      );
    }

    const windowCheck = await checkRateLimit(`resend:EMAIL_VERIFICATION:${cleanEmail}:${clientIp}`, {
      limit: 5,
      windowSeconds: 15 * 60
    });

    if (!windowCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          rateLimited: true,
          message: 'Too many requests. Please try again after 15 minutes.'
        },
        { status: 429 }
      );
    }

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
        { success: false, message: 'No account found with this email.' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Email is already verified. You can sign in directly.'
      });
    }

    const userName = user.fullName || user.name || 'Customer';

    const { code: otpCode } = await createOtp({
      userId: user._id,
      email: cleanEmail,
      purpose: 'EMAIL_VERIFICATION',
      expirationSeconds: 60
    });

    await sendOtpEmail({
      toEmail: cleanEmail,
      userName,
      otpCode,
      purpose: 'EMAIL_VERIFICATION'
    });

    return NextResponse.json({
      success: true,
      expiresIn: 60,
      message: `A fresh 6-digit code has been sent to ${cleanEmail}.`
    });

  } catch (error) {
    console.error('Resend Verification API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resend code.' },
      { status: 500 }
    );
  }
}
