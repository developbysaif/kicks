import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const dynamic = 'force-dynamic';

const DEFAULT_STOREFRONT_PRODUCTS = [
  {
    _id: 'prod-1',
    name: 'Kick Whito - White Sneaker & Joggers Cleaner',
    slug: 'kick-whito-white-sneaker-cleaner',
    sku: 'KICK-WHITO-100',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-1', name: 'Sneaker Care', slug: 'sneaker-care', imageUrl: '/Shoe Care.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-1', name: 'Sneaker Care', slug: 'sneaker-care' },
    price: 250,
    compareAtPrice: 280,
    stock: 150,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    description: 'Kick Whito is specially formulated for restoring brilliant white shine to shoes.',
    shortDescription: 'Instant white sneaker restorer and stain remover sponge applicator.'
  },
  {
    _id: 'prod-2',
    name: 'Kick Bleach Liquid Ultra Clean',
    slug: 'kick-bleach-liquid-ultra-clean',
    sku: 'KICK-BLC-500',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', imageUrl: '/laundry Care.png' },
    subcategoryId: { _id: 'sub-5', name: 'Bleach Liquid', slug: 'bleach-liquid', imageUrl: '/laundry Care.png' },
    category: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care' },
    subcategory: { _id: 'sub-5', name: 'Bleach Liquid', slug: 'bleach-liquid' },
    price: 220,
    compareAtPrice: 250,
    stock: 80,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80'],
    description: 'High performance ultra clean bleach formulations for fabric.',
    shortDescription: 'High performance ultra clean bleach liquid.'
  }
];

function getMemoryProducts() {
  if (!global.memoryProducts || !Array.isArray(global.memoryProducts) || global.memoryProducts.length === 0) {
    global.memoryProducts = [...DEFAULT_STOREFRONT_PRODUCTS];
  }
  return global.memoryProducts;
}

export async function GET(req) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestseller');
    const sort = searchParams.get('sort');
    const limitParam = searchParams.get('limit');

    if (db && mongoose.connection.readyState === 1) {
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
    }

    // Fallback when MongoDB is not connected
    let prods = getMemoryProducts();
    if (categorySlug && categorySlug !== 'all') {
      prods = prods.filter(
        (p) =>
          p.category?.slug === categorySlug ||
          p.categoryId?.slug === categorySlug ||
          p.category === categorySlug
      );
    }
    if (subcategorySlug && subcategorySlug !== 'all') {
      prods = prods.filter(
        (p) =>
          p.subcategory?.slug === subcategorySlug ||
          p.subcategoryId?.slug === subcategorySlug ||
          p.subcategory === subcategorySlug
      );
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      prods = prods.filter(
        (p) => p.name?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term)
      );
    }
    if (featured === 'true') {
      prods = prods.filter((p) => p.isFeatured);
    }
    if (bestSeller === 'true') {
      prods = prods.filter((p) => p.isBestSeller);
    }

    if (limitParam && !isNaN(parseInt(limitParam, 10))) {
      prods = prods.slice(0, parseInt(limitParam, 10));
    }

    return NextResponse.json({
      success: true,
      count: prods.length,
      products: prods
    });
  } catch (error) {
    console.error('Storefront /api/products GET error:', error);
    const prods = getMemoryProducts();
    return NextResponse.json({
      success: true,
      count: prods.length,
      products: prods
    });
  }
}
