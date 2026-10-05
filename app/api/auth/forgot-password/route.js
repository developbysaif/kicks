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
        { success: false, message: 'Please provide your email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Rate Limiting on Forgot Password: max 5 requests per 15 minutes
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';
    const rateLimit = await checkRateLimit(`forgot:${cleanEmail}:${clientIp}`, {
      limit: 5,
      windowSeconds: 15 * 60
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many password reset requests. Please try again later.' },
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

    // Enumeration Protection: Always return friendly confirmation even if user not found
    if (user) {
      const userName = user.fullName || user.name || 'Customer';

      // Generate 60-second OTP for purpose PASSWORD_RESET
      const { code: otpCode } = await createOtp({
        userId: user._id,
        email: cleanEmail,
        purpose: 'PASSWORD_RESET',
        expirationSeconds: 60
      });

      // Send real email via Resend
      await sendOtpEmail({
        toEmail: cleanEmail,
        userName,
        otpCode,
        purpose: 'PASSWORD_RESET'
      });
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: 'If an account exists for this email address, a 6-digit verification code has been sent.'
    });

  } catch (error) {
    console.error('Forgot Password API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
