import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subcategory from '@/models/Subcategory';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');

    let query = { isActive: true, status: 'published' };

    if (categoryId) {
      query.categoryId = categoryId;
    } else if (categoryParam && categoryParam !== 'all') {
      const parentCat = await Category.findOne({
        $or: [
          { slug: categoryParam },
          { name: categoryParam }
        ]
      });
      if (parentCat) {
        query.categoryId = parentCat._id;
      } else {
        // If category requested does not exist, return empty array
        return NextResponse.json({ success: true, count: 0, subcategories: [] });
      }
    }

    const subcategories = await Subcategory.find(query)
      .populate('categoryId', 'name slug imageUrl')
      .sort({ sortOrder: 1, name: 1 });

    return NextResponse.json({
      success: true,
      count: subcategories.length,
      subcategories
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
