import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import EmailVerificationToken from '@/models/EmailVerificationToken';
import { getAppUrl } from '@/lib/email';

export const dynamic = 'force-dynamic';

async function processVerification(rawToken) {
  if (!rawToken || typeof rawToken !== 'string' || rawToken.trim().length < 16) {
    return {
      status: 400,
      body: { success: false, message: 'Invalid verification link.' }
    };
  }

  const cleanToken = rawToken.trim();
  const tokenHash = crypto.createHash('sha256').update(cleanToken).digest('hex');

  const db = await connectDB();

  if (db && mongoose.connection.readyState === 1) {
    const tokenDoc = await EmailVerificationToken.findOne({ tokenHash });

    if (!tokenDoc) {
      return {
        status: 400,
        body: { success: false, message: 'Invalid verification link.' }
      };
    }

    // Check expiration (30 minutes)
    if (new Date() > new Date(tokenDoc.expiresAt)) {
      await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });
      return {
        status: 400,
        body: {
          success: false,
          expired: true,
          email: tokenDoc.email,
          message: 'This verification link has expired.'
        }
      };
    }

    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });
      return {
        status: 404,
        body: { success: false, message: 'Invalid verification link.' }
      };
    }

    if (user.emailVerified) {
      // Clean up token
      await EmailVerificationToken.deleteMany({ userId: user._id });
      return {
        status: 200,
        body: {
          success: true,
          alreadyVerified: true,
          email: user.email,
          message: 'Your email is already verified.'
        }
      };
    }

    // Mark as verified
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    // Invalidate/delete all verification tokens for this user (single-use)
    await EmailVerificationToken.deleteMany({ userId: user._id });

    return {
      status: 200,
      body: {
        success: true,
        email: user.email,
        message: 'Email verified successfully. Your account is now active.'
      }
    };

  } else {
    // Memory Store Fallback
    const memoryTokens = global.memoryTokens || [];
    const memoryUsers = global.memoryUsers || [];

    const tokenDoc = memoryTokens.find(t => t.tokenHash === tokenHash);

    if (!tokenDoc) {
      return {
        status: 400,
        body: { success: false, message: 'Invalid verification link.' }
      };
    }

    if (new Date() > new Date(tokenDoc.expiresAt)) {
      global.memoryTokens = memoryTokens.filter(t => t.tokenHash !== tokenHash);
      return {
        status: 400,
        body: {
          success: false,
          expired: true,
          email: tokenDoc.email,
          message: 'This verification link has expired.'
        }
      };
    }

    const user = memoryUsers.find(u => u._id === tokenDoc.userId || u.email === tokenDoc.email);

    if (!user) {
      return {
        status: 404,
        body: { success: false, message: 'Invalid verification link.' }
      };
    }

    if (user.emailVerified) {
      global.memoryTokens = memoryTokens.filter(t => t.userId !== user._id);
      return {
        status: 200,
        body: {
          success: true,
          alreadyVerified: true,
          email: user.email,
          message: 'Your email is already verified.'
        }
      };
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    global.memoryTokens = memoryTokens.filter(t => t.userId !== user._id);

    return {
      status: 200,
      body: {
        success: true,
        email: user.email,
        message: 'Email verified successfully. Your account is now active.'
      }
    };
  }
}

// POST /api/auth/verify-email - Programmatic verification
export async function POST(req) {
  try {
    const { token } = await req.json();
    const result = await processVerification(token);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error('Verify Email POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid verification link.' },
      { status: 500 }
    );
  }
}

// GET /api/auth/verify-email?token=... - Direct browser link clicks
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const acceptHeader = req.headers.get('accept') || '';

    // If request comes directly from browser URL click (HTML accept header), redirect to frontend page
    if (acceptHeader.includes('text/html')) {
      const appUrl = getAppUrl();
      const redirectUrl = new URL('/verify-email', appUrl);
      if (token) redirectUrl.searchParams.set('token', token);
      return NextResponse.redirect(redirectUrl);
    }

    const result = await processVerification(token);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error('Verify Email GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid verification link.' },
      { status: 500 }
    );
  }
}
