import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate new 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 8);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const db = await connectDB();
    let userName = 'Customer';

    if (db && mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email.' },
          { status: 404 }
        );
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { success: true, message: 'Email is already verified. You can sign in directly.', alreadyVerified: true }
        );
      }

      user.verificationCodeHash = otpHash;
      user.verificationCodeExpiresAt = expiresAt;
      user.verificationAttempts = 0;
      await user.save();
      userName = user.fullName || user.name || 'Customer';
    } else {
      const memoryUsers = global.memoryUsers || [];
      const user = memoryUsers.find(u => u.email === cleanEmail);

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email.' },
          { status: 404 }
        );
      }

      user.verificationCodeHash = otpHash;
      user.verificationCode = otpCode;
      user.verificationCodeExpiresAt = expiresAt;
      userName = user.name || 'Customer';
    }

    // Send email
    const emailResult = await sendVerificationEmail({
      toEmail: cleanEmail,
      userName,
      code: otpCode
    });

    return NextResponse.json({
      success: true,
      message: `A fresh 6-digit code has been sent to ${cleanEmail}.`,
      devCode: emailResult.simulated ? otpCode : undefined
    });

  } catch (error) {
    console.error('Resend Code API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to resend code.' },
      { status: 500 }
    );
  }
}
