import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const memoryUsers = global.memoryUsers || [
  { _id: 'u1', name: 'Rayyan Ansari', email: 'user@kickhomecare.com', password: 'user123', role: 'customer', phone: '03001234567', emailVerified: true },
  { _id: 'u2', name: 'Kick Admin', email: 'admin@kickhomecare.com', password: 'admin123', role: 'admin', phone: '03210009008', emailVerified: true }
];
global.memoryUsers = memoryUsers;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const db = await connectDB();

    if (db && mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email. Please click "Create Account" to register.' },
          { status: 404 }
        );
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      }

      if (user.isBlocked) {
        return NextResponse.json(
          { success: false, message: 'Your account has been suspended. Please contact support.' },
          { status: 403 }
        );
      }

      // Check email verification (admin accounts bypass)
      if (user.emailVerified === false && user.role !== 'admin') {
        return NextResponse.json(
          {
            success: false,
            requireVerification: true,
            email: cleanEmail,
            message: 'Please verify your email before logging in.'
          },
          { status: 403 }
        );
      }

      const token = generateToken({ id: user._id, role: user.role });

      return NextResponse.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.fullName || user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          emailVerified: user.emailVerified !== false,
          addresses: user.addresses
        }
      });
    } else {
      // Memory Store Fallback
      const user = memoryUsers.find(u => u.email === cleanEmail);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email. Please click "Create Account" to register.' },
          { status: 404 }
        );
      }

      let isMatch = user.password === password;
      if (!isMatch && user.password?.startsWith('$2')) {
        isMatch = await bcrypt.compare(password, user.password);
      }

      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      }

      if (user.emailVerified === false && user.role !== 'admin') {
        return NextResponse.json(
          {
            success: false,
            requireVerification: true,
            email: cleanEmail,
            message: 'Please verify your email before logging in.'
          },
          { status: 403 }
        );
      }

      const token = generateToken({ id: user._id, role: user.role });

      return NextResponse.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || '',
          emailVerified: user.emailVerified !== false,
          addresses: user.addresses || []
        }
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
