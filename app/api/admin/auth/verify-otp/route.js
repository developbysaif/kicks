import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyOtp } from '@/lib/otp';
import { generateToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Please provide official email and 6-digit verification code.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Verify OTP using our secure hashed OTP engine
    const result = await verifyOtp({
      email: cleanEmail,
      code: cleanOtp,
      purpose: 'ADMIN_EMAIL_VERIFICATION'
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

    const db = await connectDB();
    let user = null;

    if (db && mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.role = 'admin';
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        user.verificationCodeHash = null;
        user.verificationCodeExpiresAt = null;
        user.verificationAttempts = 0;
        await user.save();
      }
    } else {
      const memoryUsers = global.memoryUsers || [];
      user = memoryUsers.find(u => u.email === cleanEmail);
      if (user) {
        user.role = 'admin';
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        user.verificationCodeHash = null;
        user.verificationCodeExpiresAt = null;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Administrator account not found.' },
        { status: 404 }
      );
    }

    // Generate JWT token with role admin
    const token = generateToken({
      id: user._id,
      role: 'admin',
      emailVerified: true
    });

    const userData = {
      _id: user._id,
      name: user.fullName || user.name || 'Admin',
      email: user.email,
      role: 'admin',
      phone: user.phone || '',
      emailVerified: true
    };

    const response = NextResponse.json({
      success: true,
      token,
      user: userData,
      message: 'Admin email verified successfully. Access granted.'
    });

    // Set secure HTTP-only session cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Admin Verify OTP API Exception:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Administrator verification failed.' },
      { status: 500 }
    );
  }
}
