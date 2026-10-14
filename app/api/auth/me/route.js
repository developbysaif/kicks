import { NextResponse } from 'next/server';
import connectDB, { isDbConnected } from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      );
    }

    const db = await connectDB();
    if (!db || !isDbConnected()) {
      // Ephemeral fallback for admin session in memory or environment
      if (auth.role === 'admin') {
        return NextResponse.json({
          success: true,
          user: {
            _id: auth.id || 'admin-fallback',
            name: auth.name || 'Admin',
            email: auth.email || 'admin@kickhomecare.com',
            role: 'admin',
            phone: '',
            emailVerified: true,
            addresses: []
          }
        });
      }

      return NextResponse.json(
        { success: false, message: 'Database service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const user = await User.findById(auth.id).select('-password -passwordHash -verificationCodeHash -resetCodeHash');
    if (!user) {
      // Check in-memory user fallback if testing locally
      const memUser = (global.memoryUsers || []).find(u => String(u._id) === String(auth.id));
      if (memUser) {
        return NextResponse.json({
          success: true,
          user: {
            _id: memUser._id,
            name: memUser.fullName || memUser.name,
            email: memUser.email,
            role: memUser.role || 'customer',
            phone: memUser.phone || '',
            emailVerified: memUser.emailVerified === true,
            addresses: memUser.addresses || []
          }
        });
      }

      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.fullName || user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        emailVerified: user.emailVerified === true,
        addresses: user.addresses || []
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
