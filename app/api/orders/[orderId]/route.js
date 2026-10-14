import { NextResponse } from 'next/server';
import connectDB, { isDbConnected } from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    if (!db || !isDbConnected()) {
      return NextResponse.json(
        { success: false, message: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const { orderId } = params;

    const order = await Order.findOne({ orderId }).populate('user', 'name email phone');
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
