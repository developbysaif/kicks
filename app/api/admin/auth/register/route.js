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
    const { name, email, password, confirmPassword, phone } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide full name, official email, and password.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // 2. Enforce one-time primary Admin setup
    let existingVerifiedAdmin = null;
    if (db && mongoose.connection.readyState === 1) {
      existingVerifiedAdmin = await User.findOne({ role: 'admin', emailVerified: true });
    } else {
      const memoryUsers = global.memoryUsers || [];
      existingVerifiedAdmin = memoryUsers.find(u => u.role === 'admin' && u.emailVerified);
    }

    if (existingVerifiedAdmin) {
      return NextResponse.json(
        {
          success: false,
          adminExists: true,
          message: 'An administrator account already exists. Setup is disabled. Please log in.'
        },
        { status: 403 }
      );
    }

    // 3. Hash password securely using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let adminUser = null;
    let userId = null;

    if (db && mongoose.connection.readyState === 1) {
      adminUser = await User.findOne({ email: cleanEmail });

      if (adminUser) {
        // Unverified admin updating setup details
        adminUser.fullName = cleanName;
        adminUser.name = cleanName;
        adminUser.passwordHash = passwordHash;
        adminUser.role = 'admin';
        adminUser.emailVerified = false;
        adminUser.emailVerifiedAt = null;
        if (phone) adminUser.phone = phone.trim();
        await adminUser.save();
        userId = adminUser._id;
      } else {
        // Create new unverified admin
        adminUser = await User.create({
          fullName: cleanName,
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          phone: phone ? phone.trim() : '',
          role: 'admin',
          emailVerified: false,
          emailVerifiedAt: null
        });
        userId = adminUser._id;
      }
    } else {
      // Memory store fallback
      const memoryUsers = global.memoryUsers || [];
      adminUser = memoryUsers.find(u => u.email === cleanEmail);
      if (adminUser) {
        adminUser.fullName = cleanName;
        adminUser.name = cleanName;
        adminUser.passwordHash = passwordHash;
        adminUser.role = 'admin';
        adminUser.emailVerified = false;
        userId = adminUser._id;
      } else {
        userId = 'adm_' + Date.now();
        adminUser = {
          _id: userId,
          fullName: cleanName,
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          phone: phone ? phone.trim() : '',
          role: 'admin',
          emailVerified: false,
          emailVerifiedAt: null
        };
        memoryUsers.push(adminUser);
      }
      global.memoryUsers = memoryUsers;
    }

    // 4. Generate cryptographically secure 6-digit OTP (10 Minutes Expiration)
    const { createOtp } = await import('@/lib/otp');
    const { sendOtpEmail } = await import('@/lib/email');

    const { code: otpCode } = await createOtp({
      userId,
      email: cleanEmail,
      purpose: 'ADMIN_EMAIL_VERIFICATION',
      expirationSeconds: 600
    });

    // 5. Send real Admin OTP email
    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      userName: cleanName,
      otpCode,
      purpose: 'ADMIN_EMAIL_VERIFICATION'
    });

    return NextResponse.json({
      success: true,
      requireVerification: true,
      email: cleanEmail,
      expiresIn: 600,
      devOtp: (process.env.NODE_ENV !== 'production' || emailResult.simulated) ? otpCode : undefined,
      message: emailResult.simulated
        ? `Verification code: ${otpCode} (also logged in server console).`
        : emailResult.routedTo
          ? `A 6-digit verification code has been dispatched to your inbox (${emailResult.routedTo}).`
          : `A 6-digit verification code has been sent to ${cleanEmail}.`
    });
  } catch (error) {
    console.error('Admin Register/Setup Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to initiate administrator setup.' },
      { status: 500 }
    );
  }
}
