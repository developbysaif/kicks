import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';

export async function POST(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Please log in to place an order' },
        { status: 401 }
      );
    }

    await connectDB();
    const { orderItems, shippingAddress, paymentMethod, subtotal, discount, shippingFee, grandTotal, couponCode, notes } = await req.json();

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items in order' },
        { status: 400 }
      );
    }

    const orderId = 'KICK-' + Math.floor(100000 + Math.random() * 900000);

    // Verify stock and update product stock
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (dbProduct) {
        dbProduct.stock = Math.max(0, dbProduct.stock - item.quantity);
        await dbProduct.save();
      }
    }

    const order = await Order.create({
      orderId,
      user: auth.id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      subtotal,
      discount: discount || 0,
      shippingFee: shippingFee || 150,
      grandTotal,
      couponCode: couponCode || '',
      notes: notes || '',
      trackingHistory: [
        {
          status: 'Pending',
          comment: 'Order placed successfully via Cash on Delivery.',
          updatedAt: new Date()
        }
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      );
    }

    await connectDB();
    let orders;
    if (auth.role === 'admin') {
      orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: auth.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
