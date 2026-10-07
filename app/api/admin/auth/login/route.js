import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@kickhomecare.com').toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    await connectDB();

    // Check if user matches environment default admin
    const isEnvAdmin = cleanEmail === envAdminEmail && password === envAdminPassword;

    let user = await User.findOne({ email: cleanEmail });

    // If env admin and not in DB yet, auto-seed the admin user as verified
    if (isEnvAdmin && !user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      user = await User.create({
        fullName: 'Kick Super Admin',
        name: 'Kick Super Admin',
        email: cleanEmail,
        passwordHash,
        role: 'admin',
        emailVerified: true,
        emailVerifiedAt: new Date()
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No administrator account found with this email. Please verify your credentials or complete initial setup.' },
        { status: 404 }
      );
    }

    // Verify password
    let isMatch = false;
    if (user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } else if (user.password) {
      isMatch = user.password === password;
    }

    // Allow env admin credentials match as fallback
    if (!isMatch && isEnvAdmin) {
      isMatch = true;
      user.role = 'admin';
      user.emailVerified = true;
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    // Verify role is admin (customer accounts must not access admin panel)
    if (user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          isCustomer: true,
          message: 'Access Restricted: This account is registered as a customer and does not have administrator privileges.'
        },
        { status: 403 }
      );
    }

    // Enforce Email Verification for Admin (Master Prompt requirement)
    if (!user.emailVerified) {
      const { createOtp } = await import('@/lib/otp');
      const { sendOtpEmail } = await import('@/lib/email');

      const { code: otpCode } = await createOtp({
        userId: user._id,
        email: cleanEmail,
        purpose: 'ADMIN_EMAIL_VERIFICATION',
        expirationSeconds: 600
      });

      const emailResult = await sendOtpEmail({
        toEmail: cleanEmail,
        userName: user.fullName || user.name || 'Admin',
        otpCode,
        purpose: 'ADMIN_EMAIL_VERIFICATION'
      });

      return NextResponse.json(
        {
          success: false,
          requireVerification: true,
          email: cleanEmail,
          expiresIn: 600,
          devOtp: (process.env.NODE_ENV !== 'production' || emailResult.simulated) ? otpCode : undefined,
          message: emailResult.routedTo
            ? `Admin verification required. A 6-digit verification code has been dispatched to your inbox (${emailResult.routedTo}).`
            : "Admin account is not verified. A 6-digit verification code has been sent to your email."
        },
        { status: 403 }
      );
    }

    // Verified Admin Login Success: Generate JWT token
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
      message: 'Admin authentication successful.',
      token,
      user: userData
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
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Admin authentication failed.' },
      { status: 500 }
    );
  }
}
