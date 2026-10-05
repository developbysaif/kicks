import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import EmailVerificationToken from '@/models/EmailVerificationToken';
import { verifyOtp } from '@/lib/otp';
import { generateToken } from '@/lib/jwt';
import { getAppUrl } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, otp, email } = body;

    // 1. If 6-digit OTP is provided (or token is 6 digits)
    const code = otp || (token && /^\d{6}$/.test(String(token).trim()) ? token : null);

    if (code && email) {
      const otpResult = await verifyOtp({
        email: email.trim().toLowerCase(),
        code: String(code).trim(),
        purpose: 'EMAIL_VERIFICATION'
      });

      if (!otpResult.valid) {
        return NextResponse.json(
          {
            success: false,
            expired: otpResult.expired || false,
            maxAttemptsReached: otpResult.maxAttemptsReached || false,
            message: otpResult.message
          },
          { status: 400 }
        );
      }

      await connectDB();
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (user) {
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        await user.save();

        const authToken = generateToken({
          id: user._id,
          role: user.role || 'customer',
          emailVerified: true
        });

        return NextResponse.json({
          success: true,
          token: authToken,
          user: {
            _id: user._id,
            name: user.fullName || user.name,
            email: user.email,
            role: user.role || 'customer',
            emailVerified: true
          },
          message: 'Email verified successfully!'
        });
      }
    }

    // 2. Token-hash based fallback (for link clicks)
    const rawToken = token || code;
    if (!rawToken || typeof rawToken !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token.' },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');
    await connectDB();

    const tokenDoc = await EmailVerificationToken.findOne({ tokenHash });
    if (!tokenDoc) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification link.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(tokenDoc.expiresAt)) {
      await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });
      return NextResponse.json(
        { success: false, expired: true, message: 'This verification link has expired.' },
        { status: 400 }
      );
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();
    await EmailVerificationToken.deleteMany({ userId: user._id });

    const authToken = generateToken({
      id: user._id,
      role: user.role || 'customer',
      emailVerified: true
    });

    return NextResponse.json({
      success: true,
      token: authToken,
      user: {
        _id: user._id,
        name: user.fullName || user.name,
        email: user.email,
        role: user.role || 'customer',
        emailVerified: true
      },
      message: 'Email verified successfully!'
    });

  } catch (error) {
    console.error('Verify Email API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const appUrl = getAppUrl();
    const redirectUrl = new URL('/verify-email', appUrl);
    if (token) redirectUrl.searchParams.set('token', token);
    if (email) redirectUrl.searchParams.set('email', email);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 500 });
  }
}
