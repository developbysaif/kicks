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
    const { email, purpose = 'EMAIL_VERIFICATION' } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate Limiting: 60-second cooldown & max 5 requests per 15 minutes
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    // 60-second cooldown check
    const cooldownKey = `cooldown:${purpose}:${cleanEmail}:${clientIp}`;
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

    // 15-minute window limit check (max 5)
    const windowKey = `resend:${purpose}:${cleanEmail}:${clientIp}`;
    const windowCheck = await checkRateLimit(windowKey, { limit: 5, windowSeconds: 15 * 60 });
    if (!windowCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          rateLimited: true,
          message: 'Too many verification code requests. Please try again after 15 minutes.'
        },
        { status: 429 }
      );
    }

    // 2. Database Lookup
    const db = await connectDB();
    let user;

    if (db && mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      const memoryUsers = global.memoryUsers || [];
      user = memoryUsers.find(u => u.email === cleanEmail);
    }

    if (!user) {
      if (purpose === 'PASSWORD_RESET') {
        // Prevent email enumeration
        return NextResponse.json({
          success: true,
          message: 'If an account exists for this email address, a verification code has been sent.'
        });
      }
      return NextResponse.json(
        { success: false, message: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    if (purpose === 'EMAIL_VERIFICATION' && user.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Your email address is already verified. You can sign in directly.'
      });
    }

    const userName = user.fullName || user.name || 'Customer';

    // 3. Generate New 60-second OTP (invalidates old ones)
    const { code: otpCode } = await createOtp({
      userId: user._id,
      email: cleanEmail,
      purpose,
      expirationSeconds: 60
    });

    // 4. Send Real Email via Resend
    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      userName,
      otpCode,
      purpose
    });

    if (!emailResult.success && emailResult.provider === 'resend') {
      return NextResponse.json(
        {
          success: false,
          message: "We couldn't send the verification email right now. Please try again."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresIn: 60,
      message: `A new 6-digit verification code has been sent to ${cleanEmail}.`
    });

  } catch (error) {
    console.error('Resend OTP API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resend code. Please try again.' },
      { status: 500 }
    );
  }
}
