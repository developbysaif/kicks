import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB, { isDbConnected } from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/jwt';

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
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const cleanId = orderId.trim();
    const query = {
      $or: [
        { orderId: cleanId },
        { orderNumber: cleanId },
        ...(mongoose.Types.ObjectId.isValid(cleanId) ? [{ _id: cleanId }] : [])
      ]
    };

    const order = await Order.findOne(query).populate('user', 'fullName name email phone').lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Authorization & PII Protection Check:
    // Only the order owner or an admin can access full sensitive customer PII.
    const auth = getAuthUser(req);
    const orderUserId = String(order.user?._id || order.user || order.userId || '');
    const isOwner = auth && auth.id && orderUserId && String(auth.id) === orderUserId;
    const isAdmin = auth && auth.role === 'admin';

    if (isOwner || isAdmin) {
      return NextResponse.json({
        success: true,
        order
      });
    }

    // Public Order Tracking view (sanitized to prevent IDOR and customer data harvesting)
    const sanitizedOrder = {
      orderId: order.orderId || order.orderNumber,
      orderNumber: order.orderNumber || order.orderId,
      orderStatus: order.orderStatus || order.status || 'Pending',
      status: order.orderStatus || order.status || 'Pending',
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      orderItems: (order.orderItems || []).map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
        variation: item.variation || item.variant || ''
      })),
      subtotal: order.subtotal,
      discount: order.discount || 0,
      shippingFee: order.shippingFee || 150,
      grandTotal: order.grandTotal || order.total,
      total: order.grandTotal || order.total,
      city: order.shippingAddress?.city || order.city || 'Pakistan',
      trackingHistory: order.trackingHistory || []
    };

    return NextResponse.json({
      success: true,
      order: sanitizedOrder
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
