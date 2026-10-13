import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', description: 'Shoe cleaning, shine & protection', imageUrl: '/Shoe Care.png', isActive: true, status: 'published', sortOrder: 1 },
  { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', description: 'Bleach, whitening & fabric care', imageUrl: '/laundry Care.png', isActive: true, status: 'published', sortOrder: 2 },
  { _id: 'cat-3', name: 'Home Cleaning', slug: 'home-cleaning', description: 'Floor cleaner, phenyle & surface wash', imageUrl: '/Home Cleaning.png', isActive: true, status: 'published', sortOrder: 3 },
  { _id: 'cat-4', name: 'Dish Care', slug: 'dish-care', description: 'Dishwashing liquids & gels', imageUrl: '/dish care.png', isActive: true, status: 'published', sortOrder: 4 },
  { _id: 'cat-5', name: 'Washroom Cleaning', slug: 'washroom-cleaning', description: 'Drain openers & bathroom cleaning', imageUrl: '/washroom cleaning.png', isActive: true, status: 'published', sortOrder: 5 },
  { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection', description: 'Coils, sprays & insect protection', imageUrl: '/mosquito protection.png', isActive: true, status: 'published', sortOrder: 6 }
];

function getMemoryCategories() {
  if (!global.memoryCategories || !Array.isArray(global.memoryCategories) || global.memoryCategories.length === 0) {
    global.memoryCategories = [...DEFAULT_CATEGORIES];
  }
  return global.memoryCategories;
}

export async function GET(req) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

    if (db && mongoose.connection.readyState === 1) {
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
          .lean()
          .catch(() => []);

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
    }

    // Memory fallback when DB is not connected
    const memCats = getMemoryCategories();
    return NextResponse.json({
      success: true,
      count: memCats.length,
      categories: memCats
    });
  } catch (error) {
    console.error('Categories GET error:', error);
    const memCats = getMemoryCategories();
    return NextResponse.json({
      success: true,
      count: memCats.length,
      categories: memCats
    });
  }
}
