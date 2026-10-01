import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';

export async function PUT(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    const { orderId } = params;
    const { orderStatus, paymentStatus, comment } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const oldStatus = order.orderStatus;

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Restock items if order cancelled
    if (orderStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        const prod = await Product.findById(item.product);
        if (prod) {
          prod.stock += item.quantity;
          await prod.save();
        }
      }
    }

    order.trackingHistory.push({
      status: orderStatus || oldStatus,
      comment: comment || `Order status updated to ${orderStatus || oldStatus}`,
      updatedAt: new Date()
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
