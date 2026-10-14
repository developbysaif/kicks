import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB, { isDbConnected } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const db = await connectDB();
    const { orderId } = params;
    const body = await req.json().catch(() => ({}));
    const { orderStatus, paymentStatus, comment } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const cleanId = orderId.trim();

    if (db && isDbConnected()) {
      const order = await Order.findOne({
        $or: [
          { orderId: cleanId },
          { orderNumber: cleanId },
          ...(mongoose.Types.ObjectId.isValid(cleanId) ? [{ _id: cleanId }] : [])
        ]
      });

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }

      const oldStatus = order.orderStatus || order.status;

      if (orderStatus) {
        order.orderStatus = orderStatus;
        order.status = orderStatus;
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
          const prodId = item.product || item.productId;
          if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
            const prod = await Product.findById(prodId);
            if (prod) {
              prod.stock += (item.quantity || 1);
              await prod.save();
            }
          }
        }
      }

      order.trackingHistory = order.trackingHistory || [];
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
    }

    // In-memory fallback
    const memOrders = global.memoryOrders || [];
    const idx = memOrders.findIndex(o => o.orderId === cleanId || o._id === cleanId);
    if (idx !== -1) {
      if (orderStatus) memOrders[idx].orderStatus = orderStatus;
      if (paymentStatus) memOrders[idx].paymentStatus = paymentStatus;
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        order: memOrders[idx]
      });
    }

    return NextResponse.json(
      { success: false, message: 'Order not found' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
