import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import EmailVerificationToken from '@/models/EmailVerificationToken';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email } = await req.json().catch(() => ({}));

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address format.' },
        { status: 400 }
      );
    }

    // Rate limiting: Max 3 verification emails per 15 minutes (Section 10)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';
    const rateLimitKey = `resend:${cleanEmail}:${clientIp}`;

    const rateResult = await checkRateLimit(rateLimitKey, {
      limit: 3,
      windowSeconds: 15 * 60 // 15 minutes
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          rateLimited: true,
          retryAfter: rateResult.retryAfterSeconds,
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      );
    }

    // Generate new secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const db = await connectDB();
    let userFound = false;
    let userName = 'Valued Customer';
    let isAlreadyVerified = false;

    if (db && mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });

      if (user) {
        userFound = true;
        userName = user.fullName || user.name || 'Valued Customer';

        if (user.emailVerified) {
          isAlreadyVerified = true;
        } else {
          // Invalidate old tokens for this user
          await EmailVerificationToken.deleteMany({ userId: user._id });

          // Store new hashed token
          await EmailVerificationToken.create({
            userId: user._id,
            email: cleanEmail,
            tokenHash,
            expiresAt
          });
        }
      }
    } else {
      const memoryUsers = global.memoryUsers || [];
      const user = memoryUsers.find(u => u.email === cleanEmail);

      if (user) {
        userFound = true;
        userName = user.name || 'Valued Customer';

        if (user.emailVerified) {
          isAlreadyVerified = true;
        } else {
          const memoryTokens = global.memoryTokens || [];
          const filtered = memoryTokens.filter(t => t.userId !== user._id);
          filtered.push({
            userId: user._id,
            email: cleanEmail,
            tokenHash,
            expiresAt
          });
          global.memoryTokens = filtered;
        }
      }
    }

    // If already verified, inform user
    if (isAlreadyVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Your email is already verified. You can log in.'
      });
    }

    // If user was not found, return generic success message to prevent user enumeration
    if (!userFound) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.'
      });
    }

    // Send verification email
    const emailResult = await sendVerificationEmail({
      toEmail: cleanEmail,
      userName,
      rawToken
    });

    return NextResponse.json({
      success: true,
      message: 'A fresh verification link has been sent to your email.',
      devVerificationUrl: emailResult.simulated ? emailResult.verificationUrl : undefined
    });

  } catch (error) {
    console.error('Resend Verification API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request. Please try again later.' },
      { status: 500 }
    );
  }
}
