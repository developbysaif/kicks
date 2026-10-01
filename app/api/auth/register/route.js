import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const memoryUsers = global.memoryUsers || [
  { _id: 'u1', name: 'Rayyan Ansari', email: 'user@kickhomecare.com', password: 'user123', role: 'customer', phone: '03001234567' },
  { _id: 'u2', name: 'Kick Admin', email: 'admin@kickhomecare.com', password: 'admin123', role: 'admin', phone: '03210009008' }
];
global.memoryUsers = memoryUsers;

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const db = await connectDB();

    let user;

    if (db && mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists. Please sign in.' },
          { status: 400 }
        );
      }

      user = await User.create({
        name,
        email: cleanEmail,
        password,
        phone: phone || ''
      });
    } else {
      // Cloud Fallback Store
      const userExists = memoryUsers.find(u => u.email === cleanEmail);
      if (userExists) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists. Please sign in.' },
          { status: 400 }
        );
      }

      user = {
        _id: 'm_' + Date.now(),
        name,
        email: cleanEmail,
        password,
        role: 'customer',
        phone: phone || '',
        addresses: []
      };
      memoryUsers.push(user);
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
        phone: user.phone,
        addresses: user.addresses || []
      }
    });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

