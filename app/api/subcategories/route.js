import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Subcategory from '@/models/Subcategory';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const DEFAULT_SUBCATEGORIES = [
  // Shoe Care
  {
    _id: 'sub-1',
    name: 'Sneaker Care',
    slug: 'sneaker-care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    categorySlug: 'shoe-care',
    description: 'Specialized whiteners & sole scrub formulations',
    imageUrl: '/Shoe Care.png',
    isActive: true,
    status: 'published',
    sortOrder: 1
  },
  {
    _id: 'sub-2',
    name: 'Leather Care',
    slug: 'leather-care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    categorySlug: 'shoe-care',
    description: 'Nourishing wax creams, tins, and high-gloss polish',
    imageUrl: '/liquid shoe polish.png',
    isActive: true,
    status: 'published',
    sortOrder: 2
  },
  {
    _id: 'sub-3',
    name: 'Cleaners & Brushes',
    slug: 'cleaners',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    categorySlug: 'shoe-care',
    description: 'Active foam cleansers and horsehair brushes',
    imageUrl: '/Shoe Care.png',
    isActive: true,
    status: 'published',
    sortOrder: 3
  },
  {
    _id: 'sub-4',
    name: 'Shoe Protectors',
    slug: 'protectors',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    categorySlug: 'shoe-care',
    description: 'Hydrophobic nano-coatings against rain and stains',
    imageUrl: '/Shoe Care.png',
    isActive: true,
    status: 'published',
    sortOrder: 4
  },

  // Laundry Care
  {
    _id: 'sub-5',
    name: 'Bleach Liquid',
    slug: 'bleach-liquid',
    categoryId: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', imageUrl: '/laundry Care.png' },
    categorySlug: 'laundry-care',
    description: 'High performance ultra clean bleach formulations',
    imageUrl: '/laundry Care.png',
    isActive: true,
    status: 'published',
    sortOrder: 1
  },
  {
    _id: 'sub-6',
    name: 'Fabric Whitener',
    slug: 'fabric-whitener',
    categoryId: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', imageUrl: '/laundry Care.png' },
    categorySlug: 'laundry-care',
    description: 'Optical fabric brightening and stain removal solutions',
    imageUrl: '/whitner bleach.png',
    isActive: true,
    status: 'published',
    sortOrder: 2
  },
  {
    _id: 'sub-7',
    name: 'Fabric Conditioner',
    slug: 'fabric-softener',
    categoryId: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', imageUrl: '/laundry Care.png' },
    categorySlug: 'laundry-care',
    description: 'Fabric softness & long-lasting perfume',
    imageUrl: '/laundry Care.png',
    isActive: true,
    status: 'published',
    sortOrder: 3
  },

  // Home Cleaning
  {
    _id: 'sub-8',
    name: 'Perfumed Phenyle',
    slug: 'phenyle',
    categoryId: { _id: 'cat-3', name: 'Home Cleaning', slug: 'home-cleaning', imageUrl: '/Home Cleaning.png' },
    categorySlug: 'home-cleaning',
    description: 'Fragrant white phenyle for germ-free sparkling floors',
    imageUrl: '/Home Cleaning.png',
    isActive: true,
    status: 'published',
    sortOrder: 1
  },
  {
    _id: 'sub-9',
    name: 'Floor & Surface Cleaners',
    slug: 'surface-cleaner',
    categoryId: { _id: 'cat-3', name: 'Home Cleaning', slug: 'home-cleaning', imageUrl: '/Home Cleaning.png' },
    categorySlug: 'home-cleaning',
    description: 'Multi-surface floor mop detergents and descalers',
    imageUrl: '/phenyle.png',
    isActive: true,
    status: 'published',
    sortOrder: 2
  },

  // Dish Care
  {
    _id: 'sub-10',
    name: 'Dishwash Liquid',
    slug: 'dishwash-liquid',
    categoryId: { _id: 'cat-4', name: 'Dish Care', slug: 'dish-care', imageUrl: '/dish care.png' },
    categorySlug: 'dish-care',
    description: 'Concentrated grease-cutting dishwashing liquids with lemon oil',
    imageUrl: '/dish care.png',
    isActive: true,
    status: 'published',
    sortOrder: 1
  },
  {
    _id: 'sub-11',
    name: 'Dish Sponges',
    slug: 'dish-sponges',
    categoryId: { _id: 'cat-4', name: 'Dish Care', slug: 'dish-care', imageUrl: '/dish care.png' },
    categorySlug: 'dish-care',
    description: 'Heavy duty kitchen scouring sponges',
    imageUrl: '/dish care.png',
    isActive: true,
    status: 'published',
    sortOrder: 2
  },

  // Washroom Cleaning
  {
    _id: 'sub-12',
    name: 'Drain Opener',
    slug: 'drain-opener',
    categoryId: { _id: 'cat-5', name: 'Washroom Cleaning', slug: 'washroom-cleaning', imageUrl: '/washroom cleaning.png' },
    categorySlug: 'washroom-cleaning',
    description: 'Fast acting liquid drain openers for unclogging pipes',
    imageUrl: '/kick drain opener.png',
    isActive: true,
    status: 'published',
    sortOrder: 1
  },
  {
    _id: 'sub-13',
    name: 'Toilet & Bathroom Cleaner',
    slug: 'toilet-cleaner',
    categoryId: { _id: 'cat-5', name: 'Washroom Cleaning', slug: 'washroom-cleaning', imageUrl: '/washroom cleaning.png' },
    categorySlug: 'washroom-cleaning',
    description: '10X power cleaners for tiles, toilets, and basins',
    imageUrl: '/washroom cleaning.png',
    isActive: true,
    status: 'published',
    sortOrder: 2
  },

  // Mosquito Protection
  {
    _id: 'sub-14',
    name: 'Machine & Refills',
    slug: 'machine-refills',
    categoryId: { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection', imageUrl: '/mosquito protection.png' },
    categorySlug: 'mosquito-protection',
    description: 'Electric mosquito vaporizers and long lasting refills',
    imageUrl: '/mosquito protection.png',
    isActive: true,
    status: 'published',
    sortOrder: 1
  },
  {
    _id: 'sub-15',
    name: 'Repellent Sprays',
    slug: 'repellent-sprays',
    categoryId: { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection', imageUrl: '/mosquito protection.png' },
    categorySlug: 'mosquito-protection',
    description: 'Instant knock-down mosquito and flying insect aerosols',
    imageUrl: '/mosquito protection.png',
    isActive: true,
    status: 'published',
    sortOrder: 2
  },
  {
    _id: 'sub-16',
    name: 'Anti-Mosquito Lotion',
    slug: 'mosquito-lotion',
    categoryId: { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection', imageUrl: '/mosquito protection.png' },
    categorySlug: 'mosquito-protection',
    description: 'Gentle skin repellent lotions for indoor and outdoor safety',
    imageUrl: '/mosquito protection.png',
    isActive: true,
    status: 'published',
    sortOrder: 3
  }
];

function getFallbackSubcategories(categoryParam, categoryId) {
  let list = (global.memorySubcategories && Array.isArray(global.memorySubcategories) && global.memorySubcategories.length > 0)
    ? global.memorySubcategories
    : DEFAULT_SUBCATEGORIES;

  if (categoryParam && categoryParam !== 'all') {
    list = list.filter(
      (s) =>
        s.categorySlug === categoryParam ||
        s.categoryId?.slug === categoryParam ||
        String(s.categoryId?._id || s.categoryId) === String(categoryParam)
    );
  } else if (categoryId && categoryId !== 'all') {
    list = list.filter(
      (s) => String(s.categoryId?._id || s.categoryId) === String(categoryId)
    );
  }

  return list;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryParam = searchParams.get('category');
  const categoryId = searchParams.get('categoryId');

  try {
    const db = await connectDB();

    if (db && mongoose.connection.readyState === 1) {
      let query = { isActive: true, status: 'published' };

      if (categoryId) {
        query.categoryId = categoryId;
      } else if (categoryParam && categoryParam !== 'all') {
        const parentCat = await Category.findOne({
          $or: [
            { slug: categoryParam },
            { name: categoryParam }
          ]
        }).lean();

        if (parentCat) {
          query.categoryId = parentCat._id;
        } else {
          return NextResponse.json({ success: true, count: 0, subcategories: [] });
        }
      }

      const subcategories = await Subcategory.find(query)
        .populate('categoryId', 'name slug imageUrl')
        .sort({ sortOrder: 1, name: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        count: subcategories.length,
        subcategories
      });
    }

    // Memory fallback when DB is disconnected
    const fallbackList = getFallbackSubcategories(categoryParam, categoryId);
    return NextResponse.json({
      success: true,
      count: fallbackList.length,
      subcategories: fallbackList
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    const fallbackList = getFallbackSubcategories(categoryParam, categoryId);
    return NextResponse.json({
      success: true,
      count: fallbackList.length,
      subcategories: fallbackList
    });
  }
}
