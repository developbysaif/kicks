import { NextResponse } from 'next/server';
import connectDB, { isDbConnected } from '@/lib/db';
import Review from '@/models/Review';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    if (!db || !isDbConnected()) {
      return NextResponse.json({ success: true, reviews: [] });
    }

    const reviews = await Review.find().populate('product', 'name slug images').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    if (!db || !isDbConnected()) {
      return NextResponse.json({ success: false, message: 'Database connection offline.' }, { status: 503 });
    }

    const { _id, isApproved } = await req.json();
    const review = await Review.findByIdAndUpdate(_id, { isApproved }, { new: true });
    return NextResponse.json({ success: true, message: 'Review status updated', review });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    if (!db || !isDbConnected()) {
      return NextResponse.json({ success: false, message: 'Database connection offline.' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
