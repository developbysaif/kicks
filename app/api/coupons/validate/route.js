import { NextResponse } from 'next/server';
import connectDB, { isDbConnected } from '@/lib/db';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json().catch(() => ({}));

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Please enter a coupon code' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const db = await connectDB();

    if (db && isDbConnected()) {
      const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
      if (!coupon) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired coupon code' },
          { status: 404 }
        );
      }

      if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return NextResponse.json(
          { success: false, message: 'This coupon has expired' },
          { status: 400 }
        );
      }

      if (subtotal && subtotal < (coupon.minOrderAmount || 0)) {
        return NextResponse.json(
          { success: false, message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required for this coupon` },
          { status: 400 }
        );
      }

      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      return NextResponse.json({
        success: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: Math.round(discountAmount)
        }
      });
    }

    // Fallback if DB is temporarily offline
    if (cleanCode === 'KICK10' || cleanCode === 'WELCOME10') {
      const discount = Math.round((subtotal || 0) * 0.1);
      return NextResponse.json({
        success: true,
        coupon: {
          code: cleanCode,
          discountType: 'percentage',
          discountValue: 10,
          discountAmount: discount
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid coupon code or coupon service temporarily offline.' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
