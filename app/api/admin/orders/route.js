import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const DEFAULT_ADMIN_ORDERS = [
  {
    _id: 'ord_1',
    orderId: 'KICK-892101',
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash on Delivery',
    grandTotal: 1250,
    subtotal: 1100,
    shippingFee: 150,
    createdAt: new Date().toISOString(),
    shippingAddress: {
      fullName: 'Rayyan Ansari',
      phone: '+923001234567',
      addressLine: 'House 45, Street 12, DHA Phase 5',
      city: 'Lahore',
      province: 'Punjab'
    },
    orderItems: [
      {
        name: 'Kick Whito - White Sneaker & Joggers Cleaner',
        quantity: 2,
        price: 220,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    _id: 'ord_2',
    orderId: 'KICK-445120',
    orderStatus: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    grandTotal: 890,
    subtotal: 740,
    shippingFee: 150,
    createdAt: new Date().toISOString(),
    shippingAddress: {
      fullName: 'Usman Ali',
      phone: '+923219876543',
      addressLine: 'Flat 4B, Gulberg Heights, Gulberg III',
      city: 'Lahore',
      province: 'Punjab'
    },
    orderItems: [
      {
        name: 'Kick Bleach Liquid Ultra Clean 500ml',
        quantity: 3,
        price: 220,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

function getMemoryOrders() {
  if (!global.memoryOrders || !Array.isArray(global.memoryOrders) || global.memoryOrders.length === 0) {
    global.memoryOrders = [...DEFAULT_ADMIN_ORDERS];
  }
  return global.memoryOrders;
}

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (db && mongoose.connection.readyState === 1) {
      let query = {};
      if (status && status !== 'all') {
        query.$or = [
          { orderStatus: status },
          { orderStatus: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() },
          { status: status },
          { status: status.toLowerCase() }
        ];
      }
      if (search && search.trim()) {
        const term = search.trim();
        const searchConditions = [
          { orderId: { $regex: term, $options: 'i' } },
          { orderNumber: { $regex: term, $options: 'i' } },
          { 'shippingAddress.fullName': { $regex: term, $options: 'i' } },
          { 'shippingAddress.phone': { $regex: term, $options: 'i' } },
          { 'shippingAddress.city': { $regex: term, $options: 'i' } },
          { customerName: { $regex: term, $options: 'i' } },
          { phone: { $regex: term, $options: 'i' } },
          { email: { $regex: term, $options: 'i' } }
        ];
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchConditions }];
          delete query.$or;
        } else {
          query.$or = searchConditions;
        }
      }

      const orders = await Order.find(query)
        .populate('user', 'fullName name email phone')
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: orders.length,
        orders
      });
    }

    // Memory fallback
    let memOrders = getMemoryOrders();
    if (status && status !== 'all') {
      memOrders = memOrders.filter(o => o.orderStatus === status);
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      memOrders = memOrders.filter(o =>
        (o.orderId && o.orderId.toLowerCase().includes(term)) ||
        (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(term))
      );
    }

    return NextResponse.json({
      success: true,
      count: memOrders.length,
      orders: memOrders
    });
  } catch (error) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json({ success: true, count: 0, orders: getMemoryOrders() });
  }
}

export async function PUT(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const body = await req.json();
    const { orderId, orderStatus, paymentStatus, comment } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    if (db && mongoose.connection.readyState === 1) {
      const order = await Order.findOne({
        $or: [
          { orderId: orderId },
          ...(mongoose.Types.ObjectId.isValid(orderId) ? [{ _id: orderId }] : [])
        ]
      });

      if (!order) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
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
          if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
            const prod = await Product.findById(item.product);
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
        comment: comment || `Order updated by Admin to ${orderStatus || oldStatus}`,
        updatedAt: new Date()
      });

      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        order
      });
    }

    // Memory fallback
    const memOrders = getMemoryOrders();
    const orderIndex = memOrders.findIndex(o => o.orderId === orderId || o._id === orderId);
    if (orderIndex !== -1) {
      if (orderStatus) memOrders[orderIndex].orderStatus = orderStatus;
      if (paymentStatus) memOrders[orderIndex].paymentStatus = paymentStatus;
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        order: memOrders[orderIndex]
      });
    }

    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Admin order PUT error:', error);
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    if (db && mongoose.connection.readyState === 1) {
      await Order.findOneAndDelete({
        $or: [
          { orderId: id },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      });
      return NextResponse.json({ success: true, message: 'Order deleted successfully' });
    }

    // Memory fallback
    global.memoryOrders = (global.memoryOrders || []).filter(o => o.orderId !== id && o._id !== id);
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
