import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    let hasAdmin = false;

    if (db && mongoose.connection.readyState === 1) {
      const verifiedAdmin = await User.findOne({ role: 'admin', emailVerified: true });
      hasAdmin = Boolean(verifiedAdmin);
    } else {
      const memoryUsers = global.memoryUsers || [];
      const verifiedAdmin = memoryUsers.find(u => u.role === 'admin' && u.emailVerified);
      hasAdmin = Boolean(verifiedAdmin);
    }

    return NextResponse.json({
      success: true,
      hasAdmin,
      canSetup: !hasAdmin
    });
  } catch (error) {
    console.error('Check Admin Setup Status Error:', error);
    return NextResponse.json({
      success: false,
      hasAdmin: true, // Default to true on error for safety
      canSetup: false
    });
  }
}
