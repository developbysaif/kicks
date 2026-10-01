import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const product = await Product.findOne({ slug, isActive: true }).populate('category');
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const reviews = await Review.find({ product: product._id, isApproved: true }).sort({ createdAt: -1 });

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    return NextResponse.json({
      success: true,
      product,
      reviews,
      relatedProducts
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
