import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import EmailVerificationToken from '@/models/EmailVerificationToken';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const memoryUsers = global.memoryUsers || [
  { _id: 'u1', name: 'Rayyan Ansari', email: 'user@kickhomecare.com', password: 'user123', role: 'customer', phone: '03001234567', emailVerified: true },
  { _id: 'u2', name: 'Kick Admin', email: 'admin@kickhomecare.com', password: 'admin123', role: 'admin', phone: '03210009008', emailVerified: true }
];
global.memoryUsers = memoryUsers;

const memoryTokens = global.memoryTokens || [];
global.memoryTokens = memoryTokens;

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide full name, email and password' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Securely hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate cryptographically secure random verification token (64 hex chars)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry

    const db = await connectDB();
    let userId;

    if (db && mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });

      if (existingUser) {
        if (existingUser.emailVerified) {
          return NextResponse.json(
            { success: false, message: 'An account with this email already exists. Please sign in.' },
            { status: 400 }
          );
        }

        // Update details for unverified existing record
        existingUser.fullName = name;
        existingUser.password = password;
        existingUser.passwordHash = passwordHash;
        if (phone) existingUser.phone = phone;
        existingUser.emailVerified = false;
        existingUser.emailVerifiedAt = null;
        await existingUser.save();
        userId = existingUser._id;
      } else {
        // Create new unverified user
        const newUser = await User.create({
          fullName: name,
          name,
          email: cleanEmail,
          password,
          passwordHash,
          phone: phone || '',
          emailVerified: false,
          emailVerifiedAt: null
        });
        userId = newUser._id;
      }

      // Invalidate any old tokens for this user
      await EmailVerificationToken.deleteMany({ userId });

      // Save hashed verification token
      await EmailVerificationToken.create({
        userId,
        email: cleanEmail,
        tokenHash,
        expiresAt
      });

    } else {
      // Memory Store Fallback
      const existingUser = memoryUsers.find(u => u.email === cleanEmail);
      if (existingUser && existingUser.emailVerified) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists. Please sign in.' },
          { status: 400 }
        );
      }

      if (existingUser) {
        existingUser.name = name;
        existingUser.password = password;
        existingUser.passwordHash = passwordHash;
        existingUser.phone = phone || '';
        existingUser.emailVerified = false;
        existingUser.emailVerifiedAt = null;
        userId = existingUser._id;
      } else {
        userId = 'm_' + Date.now();
        memoryUsers.push({
          _id: userId,
          name,
          email: cleanEmail,
          password,
          passwordHash,
          role: 'customer',
          phone: phone || '',
          emailVerified: false,
          emailVerifiedAt: null,
          addresses: []
        });
      }

      // Invalidate old memory tokens
      const filtered = memoryTokens.filter(t => t.userId !== userId);
      filtered.push({
        userId,
        email: cleanEmail,
        tokenHash,
        expiresAt
      });
      global.memoryTokens = filtered;
    }

    // Send branded verification email (Resend / SMTP / Dev fallback)
    const emailResult = await sendVerificationEmail({
      toEmail: cleanEmail,
      userName: name,
      rawToken
    });

    return NextResponse.json({
      success: true,
      requireVerification: true,
      email: cleanEmail,
      message: "We've sent a verification link to your email address. Please verify your email before logging in.",
      devVerificationUrl: emailResult.simulated ? emailResult.verificationUrl : undefined
    });

  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
