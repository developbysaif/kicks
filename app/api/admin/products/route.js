import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/jwt';
import slugify from 'slugify';

async function resolveCategoryId(categoryIdOrValue) {
  if (!categoryIdOrValue) {
    const firstCat = await Category.findOne({ isActive: true });
    return firstCat?._id || null;
  }

  // If it's already an ObjectId or valid hex string
  if (mongoose.Types.ObjectId.isValid(categoryIdOrValue)) {
    return categoryIdOrValue;
  }

  // If it's an object with _id
  if (typeof categoryIdOrValue === 'object' && categoryIdOrValue._id) {
    if (mongoose.Types.ObjectId.isValid(categoryIdOrValue._id)) {
      return categoryIdOrValue._id;
    }
  }

  // Lookup by slug or name
  const found = await Category.findOne({
    $or: [
      { slug: categoryIdOrValue },
      { name: categoryIdOrValue },
      { slug: slugify(String(categoryIdOrValue), { lower: true }) }
    ]
  });

  if (found) return found._id;

  // Fallback to first available category
  const firstCat = await Category.findOne({ isActive: true });
  return firstCat?._id || null;
}

export async function POST(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    const data = await req.json();

    const rawCategoryId = data.categoryId || data.category;
    const resolvedCatId = await resolveCategoryId(rawCategoryId);

    if (!resolvedCatId) {
      return NextResponse.json(
        { success: false, message: 'Valid product category is required' },
        { status: 400 }
      );
    }

    const slug = data.slug || slugify(data.name, { lower: true, strict: true });
    const sku = data.sku || 'KICK-' + Math.floor(1000 + Math.random() * 9000);

    // Format images array (support 1 to 6 images)
    let images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    if (images.length === 0 && data.image) {
      images = [data.image];
    }
    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'];
    }

    const productPayload = {
      ...data,
      categoryId: resolvedCatId,
      category: resolvedCatId,
      images,
      slug,
      sku
    };

    const product = await Product.create(productPayload);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    const { _id, ...data } = await req.json();

    const updatePayload = { ...data };

    if (data.categoryId || data.category) {
      const resolvedCatId = await resolveCategoryId(data.categoryId || data.category);
      if (resolvedCatId) {
        updatePayload.categoryId = resolvedCatId;
        updatePayload.category = resolvedCatId;
      }
    }

    if (Array.isArray(data.images)) {
      updatePayload.images = data.images.filter(Boolean);
    } else if (data.image) {
      updatePayload.images = [data.image];
    }

    const product = await Product.findByIdAndUpdate(_id, updatePayload, { new: true });

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
