import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const product = await Product.findOne({
      slug,
      status: 'published',
      isActive: { $ne: false }
    })
      .populate('categoryId', 'name slug imageUrl')
      .populate('subcategoryId', 'name slug imageUrl')
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const reviews = await Review.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    // DYNAMIC RELATED PRODUCTS LOGIC:
    // 1. First look for products with the SAME Subcategory (if subcategory assigned)
    // 2. If fewer than 4, fill remaining with SAME Category
    // 3. Strictly exclude current product
    // 4. Published products only
    let relatedProducts = [];

    if (product.subcategoryId) {
      relatedProducts = await Product.find({
        subcategoryId: product.subcategoryId._id || product.subcategoryId,
        _id: { $ne: product._id },
        status: 'published',
        isActive: { $ne: false }
      })
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name slug')
        .limit(4)
        .lean();
    }

    if (relatedProducts.length < 4 && product.categoryId) {
      const existingIds = [product._id, ...relatedProducts.map((p) => p._id)];
      const categoryExtras = await Product.find({
        categoryId: product.categoryId._id || product.categoryId,
        _id: { $nin: existingIds },
        status: 'published',
        isActive: { $ne: false }
      })
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name slug')
        .limit(4 - relatedProducts.length)
        .lean();

      relatedProducts = [...relatedProducts, ...categoryExtras];
    }

    return NextResponse.json({
      success: true,
      product,
      reviews,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
