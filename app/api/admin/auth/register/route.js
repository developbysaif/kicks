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
        { success: false, message: 'Please provide full name, email, and password.' },
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

    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // If user already exists, upgrade to admin and update credentials
      user.fullName = cleanName;
      user.name = cleanName;
      user.passwordHash = passwordHash;
      user.role = 'admin';
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      if (phone) user.phone = phone.trim();
      await user.save();
    } else {
      // Create new admin user
      user = await User.create({
        fullName: cleanName,
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        phone: phone ? phone.trim() : '',
        role: 'admin',
        emailVerified: true,
        emailVerifiedAt: new Date()
      });
    }

    // Generate JWT token for immediate admin login
    const token = generateToken({
      id: user._id,
      role: 'admin',
      emailVerified: true
    });

    const userData = {
      _id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      role: 'admin',
      phone: user.phone || '',
      emailVerified: true
    };

    return NextResponse.json({
      success: true,
      message: 'Admin account registered and activated successfully.',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Admin Register Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to register administrator account.' },
      { status: 500 }
    );
  }
}
