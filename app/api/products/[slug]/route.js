import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

const DEFAULT_SLUG_PRODUCTS = [
  {
    _id: 'prod-1',
    name: 'Kick Whito - White Sneaker & Joggers Cleaner',
    slug: 'kick-whito-white-sneaker-cleaner',
    sku: 'KICK-WHITO-100',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-1', name: 'Sneaker Care', slug: 'sneaker-care', imageUrl: '/Shoe Care.png' },
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

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const { slug } = params;

    if (db && mongoose.connection.readyState === 1) {
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
        .lean()
        .catch(() => []);

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
          .lean()
          .catch(() => []);
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
          .lean()
          .catch(() => []);

        relatedProducts = [...relatedProducts, ...categoryExtras];
      }

      return NextResponse.json({
        success: true,
        product,
        reviews,
        relatedProducts
      });
    }

    // Memory fallback when DB is disconnected
    const allMemory = (global.memoryProducts && Array.isArray(global.memoryProducts)) ? global.memoryProducts : DEFAULT_SLUG_PRODUCTS;
    const product = allMemory.find((p) => p.slug === slug);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const relatedProducts = allMemory.filter((p) => p.slug !== slug).slice(0, 4);

    return NextResponse.json({
      success: true,
      product,
      reviews: [],
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
