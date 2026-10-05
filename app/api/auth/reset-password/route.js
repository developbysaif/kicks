import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyOtp } from '@/lib/otp';

export const dynamic = 'force-dynamic';

const RESET_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'kick_home_care_reset_secret_2026';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp, resetToken, newPassword, confirmPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and new password.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify Authorization: either via resetToken or direct OTP code
    let authorized = false;

    if (resetToken) {
      try {
        const decoded = jwt.verify(resetToken, RESET_SECRET);
        if (decoded.email === cleanEmail && decoded.purpose === 'PASSWORD_RESET_AUTHORIZED') {
          authorized = true;
        }
      } catch (tokenErr) {
        return NextResponse.json(
          { success: false, message: 'Your password reset session has expired. Please request a new code.' },
          { status: 401 }
        );
      }
    } else if (otp) {
      const otpResult = await verifyOtp({
        email: cleanEmail,
        code: otp,
        purpose: 'PASSWORD_RESET'
      });

      if (!otpResult.valid) {
        return NextResponse.json(
          {
            success: false,
            expired: otpResult.expired || false,
            message: otpResult.message
          },
          { status: 400 }
        );
      }
      authorized = true;
    } else {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid verification code or reset authorization.' },
        { status: 400 }
      );
    }

    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized password reset request.' },
        { status: 403 }
      );
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    const db = await connectDB();

    if (db && mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
      }

      user.passwordHash = newPasswordHash;
      user.resetCodeHash = null;
      user.resetCodeExpiresAt = null;
      user.resetAttempts = 0;
      await user.save();
    } else {
      const memoryUsers = global.memoryUsers || [];
      const user = memoryUsers.find(u => u.email === cleanEmail);
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
      }

      user.password = newPassword;
      user.passwordHash = newPasswordHash;
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been updated successfully. Please sign in with your new password.'
    });

  } catch (error) {
    console.error('Reset Password API Exception:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
