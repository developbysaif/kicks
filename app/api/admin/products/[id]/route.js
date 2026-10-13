import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const { id } = params;

    if (db && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id)
        .populate('categoryId', 'name slug imageUrl')
        .populate('subcategoryId', 'name slug imageUrl')
        .lean();

      if (product) {
        return NextResponse.json({ success: true, product });
      }
    }

    // Memory fallback lookup
    const memoryProducts = global.memoryProducts || [];
    const memProd = memoryProducts.find(p => String(p._id) === String(id) || p.slug === id);
    if (memProd) {
      return NextResponse.json({ success: true, product: memProd });
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const { id } = params;
    const updateData = await req.json();

    if (db && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
        .populate('categoryId', 'name slug imageUrl')
        .populate('subcategoryId', 'name slug imageUrl');

      if (updated) {
        return NextResponse.json({ success: true, message: 'Product updated successfully', product: updated });
      }
    }

    // Memory fallback
    if (global.memoryProducts && Array.isArray(global.memoryProducts)) {
      const idx = global.memoryProducts.findIndex(p => String(p._id) === String(id) || p.slug === id);
      if (idx !== -1) {
        global.memoryProducts[idx] = { ...global.memoryProducts[idx], ...updateData };
        return NextResponse.json({ success: true, message: 'Product updated successfully', product: global.memoryProducts[idx] });
      }
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const { id } = params;

    if (db && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    }

    global.memoryProducts = (global.memoryProducts || []).filter(p => String(p._id) !== String(id) && p.slug !== id);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
