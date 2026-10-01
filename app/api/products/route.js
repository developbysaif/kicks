import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestseller');
    const sort = searchParams.get('sort');

    let query = { isActive: true };

    if (categorySlug) {
      const categoryObj = await Category.findOne({ slug: categorySlug });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (bestSeller === 'true') {
      query.isBestSeller = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { salePrice: 1, price: 1 };
    if (sort === 'price-high') sortOption = { salePrice: -1, price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(query).populate('category').sort(sortOption);

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
