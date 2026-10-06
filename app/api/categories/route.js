import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

    const categories = await Category.find({ isActive: true, status: { $ne: 'archived' } })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    if (includeSubcategories) {
      const categoryIds = categories.map((c) => c._id);
      const subcategories = await Subcategory.find({
        categoryId: { $in: categoryIds },
        isActive: true,
        status: { $ne: 'archived' }
      })
        .sort({ sortOrder: 1, name: 1 })
        .lean();

      const subcatMap = {};
      subcategories.forEach((s) => {
        const catIdStr = s.categoryId.toString();
        if (!subcatMap[catIdStr]) subcatMap[catIdStr] = [];
        subcatMap[catIdStr].push(s);
      });

      const categoriesWithSubs = categories.map((c) => ({
        ...c,
        subcategories: subcatMap[c._id.toString()] || []
      }));

      return NextResponse.json({
        success: true,
        count: categoriesWithSubs.length,
        categories: categoriesWithSubs
      });
    }

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json(
      { success: false, message: error.message, categories: [] },
      { status: 500 }
    );
  }
}
