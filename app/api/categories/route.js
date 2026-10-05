import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    description: 'Premium shoe shiners, white sneaker cleaners, polish sponges, shoe wax, deodorizers, and brushes.',
    imageUrl: '/Shoe Care.png',
    isActive: true
  },
  {
    name: 'Laundry Care',
    slug: 'laundry-care',
    description: 'High performance bleach liquid, blue whitening agents, and fabric conditioners for brilliant clothes.',
    imageUrl: '/laundry Care.png',
    isActive: true
  },
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'All-purpose surface cleaners, descaling bathroom sprays, and heavy duty toilet cleaner power gels.',
    imageUrl: '/Home Cleaning.png',
    isActive: true
  },
  {
    name: 'Dish Care',
    slug: 'dish-care',
    description: 'Tough grease-cutting dishwashing liquids infused with lemon oil and heavy duty dish sponges.',
    imageUrl: '/dish care.png',
    isActive: true
  },
  {
    name: 'Washroom Cleaning',
    slug: 'washroom-cleaning',
    description: 'Fast acting liquid drain openers, bathroom cleaners, and toilet gels for sparkling clean washrooms.',
    imageUrl: '/washroom cleaning.png',
    isActive: true
  },
  {
    name: 'Mosquito Protection',
    slug: 'mosquito-protection',
    description: 'Electric liquid mosquito repellents, anti-mosquito skin lotions, coils, and multi-insect sprays.',
    imageUrl: '/mosquito protection.png',
    isActive: true
  }
];

export async function GET() {
  try {
    await connectDB();
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // If categories collection is empty in database, automatically seed default website categories
    if (!categories || categories.length === 0) {
      try {
        await Category.insertMany(DEFAULT_CATEGORIES);
        categories = await Category.find({ isActive: true }).sort({ name: 1 });
      } catch (seedErr) {
        console.warn('Error auto-seeding categories, returning defaults:', seedErr.message);
      }
    }

    if (!categories || categories.length === 0) {
      categories = DEFAULT_CATEGORIES.map((c, i) => ({
        _id: `default_cat_${i + 1}`,
        ...c
      }));
    }

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Categories GET error:', error);
    // Return fallback website categories even on error so website and admin always work
    return NextResponse.json({
      success: true,
      categories: DEFAULT_CATEGORIES.map((c, i) => ({
        _id: `fallback_cat_${i + 1}`,
        ...c
      }))
    });
  }
}
