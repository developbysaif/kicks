import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestseller');
    const sort = searchParams.get('sort');
    const limitParam = searchParams.get('limit');

    // ONLY published products are visible on storefront!
    let query = {
      $and: [
        { status: 'published' },
        { isActive: { $ne: false } }
      ]
    };

    // Filter by Category
    if (categorySlug && categorySlug !== 'all') {
      const categoryObj = await Category.findOne({
        $or: [
          { slug: categorySlug },
          { name: categorySlug }
        ]
      });

      if (categoryObj) {
        query.$and.push({
          $or: [
            { categoryId: categoryObj._id },
            { category: categoryObj._id }
          ]
        });
      } else {
        // Category slug was requested but doesn't exist -> return 0 products!
        return NextResponse.json({
          success: true,
          count: 0,
          products: []
        });
      }
    }

    // Filter by Subcategory
    if (subcategorySlug && subcategorySlug !== 'all') {
      const subcategoryObj = await Subcategory.findOne({
        $or: [
          { slug: subcategorySlug },
          { name: subcategorySlug }
        ]
      });

      if (subcategoryObj) {
        query.$and.push({
          $or: [
            { subcategoryId: subcategoryObj._id },
            { subcategory: subcategoryObj._id }
          ]
        });
      } else {
        // Subcategory slug requested but doesn't exist -> return 0 products!
        return NextResponse.json({
          success: true,
          count: 0,
          products: []
        });
      }
    }

    // Search query
    if (search && search.trim()) {
      const term = search.trim();
      query.$and.push({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } },
          { shortDescription: { $regex: term, $options: 'i' } },
          { tags: { $regex: term, $options: 'i' } }
        ]
      });
    }

    if (featured === 'true') {
      query.$and.push({ isFeatured: true });
    }

    if (bestSeller === 'true') {
      query.$and.push({ isBestSeller: true });
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { ratingAvg: -1, rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    let dbQuery = Product.find(query)
      .populate('categoryId', 'name slug imageUrl')
      .populate('subcategoryId', 'name slug imageUrl')
      .sort(sortOption);

    if (limitParam && !isNaN(parseInt(limitParam, 10))) {
      dbQuery = dbQuery.limit(parseInt(limitParam, 10));
    }

    const products = await dbQuery.lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Storefront /api/products GET error:', error);
    return NextResponse.json(
      { success: false, message: error.message, products: [] },
      { status: 500 }
    );
  }
}
