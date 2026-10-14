import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB, { isDbConnected } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Please log in to place an order' },
        { status: 401 }
      );
    }

    if (auth.emailVerified === false && auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, requireVerification: true, message: 'Please verify your email address to place orders.' },
        { status: 403 }
      );
    }

    const db = await connectDB();
    if (!db || !isDbConnected()) {
      return NextResponse.json(
        { success: false, message: 'Database service is temporarily unavailable. Please verify MONGODB_URI or try again shortly.' },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes
    } = body;

    // 1. Validate order items presence
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items in order' },
        { status: 400 }
      );
    }

    // 2. Validate shipping address fields
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.city) {
      return NextResponse.json(
        { success: false, message: 'Full name, phone, city, and address are required to place an order.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(shippingAddress.phone).trim();
    if (cleanPhone.replace(/[^0-9]/g, '').length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number (at least 10 digits).' },
        { status: 400 }
      );
    }

    // 3. Server-side product price & inventory verification (prevent price/stock tampering)
    let calculatedSubtotal = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const prodId = item.product || item.productId;
      if (!prodId || !mongoose.Types.ObjectId.isValid(prodId)) {
        return NextResponse.json(
          { success: false, message: `Invalid product identifier: ${prodId}` },
          { status: 400 }
        );
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return NextResponse.json(
          { success: false, message: `Invalid quantity for item: ${item.name || prodId}` },
          { status: 400 }
        );
      }

      const dbProduct = await Product.findById(prodId);
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, message: `Product "${item.name || prodId}" not found in catalog.` },
          { status: 404 }
        );
      }

      if (dbProduct.status === 'archived' || dbProduct.isActive === false) {
        return NextResponse.json(
          { success: false, message: `Product "${dbProduct.name}" is no longer available.` },
          { status: 400 }
        );
      }

      // Check stock availability
      if (dbProduct.trackInventory && !dbProduct.allowBackorders && dbProduct.stock < qty) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} unit(s) available.`
          },
          { status: 400 }
        );
      }

      // Authoritative server-side price from MongoDB
      const authoritativePrice = Number(dbProduct.price) || 0;
      calculatedSubtotal += authoritativePrice * qty;

      verifiedOrderItems.push({
        product: dbProduct._id,
        productId: dbProduct._id,
        name: dbProduct.name,
        price: authoritativePrice,
        image: dbProduct.images?.[0] || item.image || '',
        quantity: qty,
        variation: item.variation || item.variant || '',
        variant: item.variant || item.variation || '',
        sku: dbProduct.sku || ''
      });
    }

    // 4. Server-side coupon verification & discount calculation
    let calculatedDiscount = 0;
    let cleanCouponCode = '';

    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      cleanCouponCode = couponCode.trim().toUpperCase();
      const dbCoupon = await Coupon.findOne({ code: cleanCouponCode, isActive: true });

      if (!dbCoupon) {
        return NextResponse.json(
          { success: false, message: `Invalid coupon code: "${cleanCouponCode}".` },
          { status: 400 }
        );
      }

      const expiry = dbCoupon.expiresAt || dbCoupon.expiryDate;
      if (expiry && new Date() > new Date(expiry)) {
        return NextResponse.json(
          { success: false, message: `Coupon "${cleanCouponCode}" has expired.` },
          { status: 400 }
        );
      }

      const minOrder = dbCoupon.minOrder || dbCoupon.minOrderAmount || 0;
      if (calculatedSubtotal < minOrder) {
        return NextResponse.json(
          { success: false, message: `Coupon "${cleanCouponCode}" requires a minimum order of Rs. ${minOrder}.` },
          { status: 400 }
        );
      }

      const isPercentage = dbCoupon.type === 'percent' || dbCoupon.discountType === 'percentage';
      const couponValue = Number(dbCoupon.value || dbCoupon.discountValue) || 0;

      if (isPercentage) {
        calculatedDiscount = Math.round((calculatedSubtotal * couponValue) / 100);
        if (dbCoupon.maxDiscount && calculatedDiscount > dbCoupon.maxDiscount) {
          calculatedDiscount = dbCoupon.maxDiscount;
        }
      } else {
        calculatedDiscount = couponValue;
      }

      calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);

      // Increment coupon used count
      await Coupon.findByIdAndUpdate(dbCoupon._id, { $inc: { usedCount: 1 } }).catch(() => {});
    }

    // 5. Authoritative Shipping Fee & Grand Total Calculation
    // Free shipping on orders over Rs. 2,500; otherwise Rs. 150 standard courier charge
    const serverShippingFee = calculatedSubtotal >= 2500 ? 0 : 150;
    const serverGrandTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + serverShippingFee);

    // 6. Atomically deduct product inventory from MongoDB
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // 7. Create persistent order document in MongoDB Atlas
    const orderId = 'KICK-' + Math.floor(100000 + Math.random() * 900000);

    const order = await Order.create({
      orderId,
      orderNumber: orderId,
      user: auth.id,
      userId: auth.id,
      customerName: shippingAddress.fullName.trim(),
      phone: cleanPhone,
      email: (auth.email || shippingAddress.email || '').toLowerCase().trim(),
      city: shippingAddress.city.trim(),
      address: shippingAddress.addressLine.trim(),
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: cleanPhone,
        addressLine: shippingAddress.addressLine.trim(),
        city: shippingAddress.city.trim(),
        province: shippingAddress.province?.trim() || 'Punjab',
        postalCode: shippingAddress.postalCode?.trim() || '54000',
        country: 'Pakistan'
      },
      paymentMethod: paymentMethod?.trim() || 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      status: 'Pending',
      orderItems: verifiedOrderItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shippingFee: serverShippingFee,
      grandTotal: serverGrandTotal,
      total: serverGrandTotal,
      couponCode: cleanCouponCode,
      notes: (notes || '').trim(),
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
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order' },
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

    if (auth.emailVerified === false && auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, requireVerification: true, message: 'Please verify your email address to view orders.' },
        { status: 403 }
      );
    }

    const db = await connectDB();
    if (!db || !isDbConnected()) {
      return NextResponse.json({
        success: true,
        orders: []
      });
    }

    let orders;
    if (auth.role === 'admin') {
      orders = await Order.find()
        .populate('user', 'fullName name email phone')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      orders = await Order.find({
        $or: [{ user: auth.id }, { userId: auth.id }]
      })
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
