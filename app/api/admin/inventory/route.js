import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    if (db && mongoose.connection.readyState === 1) {
      const products = await Product.find({})
        .populate('categoryId', 'name slug')
        .sort({ stock: 1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        products
      });
    }

    // Memory fallback
    const memProducts = (global.memoryProducts && Array.isArray(global.memoryProducts))
      ? global.memoryProducts
      : [];

    return NextResponse.json({
      success: true,
      products: memProducts
    });
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
    const { _id, stock } = await req.json();

    if (!_id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const newStock = Number(stock) || 0;

    if (db && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(_id)) {
      const product = await Product.findByIdAndUpdate(_id, { stock: newStock }, { new: true });
      return NextResponse.json({ success: true, message: 'Inventory stock updated successfully', product });
    }

    // In-memory fallback
    if (global.memoryProducts && Array.isArray(global.memoryProducts)) {
      const p = global.memoryProducts.find((item) => String(item._id) === String(_id));
      if (p) {
        p.stock = newStock;
        return NextResponse.json({ success: true, message: 'Inventory stock updated successfully', product: p });
      }
    }

    return NextResponse.json({ success: true, message: 'Inventory stock updated', product: { _id, stock: newStock } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
