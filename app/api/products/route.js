import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const dynamic = 'force-dynamic';

const DEFAULT_STOREFRONT_PRODUCTS = [
  // Shoe Care Products
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
    categorySlug: 'shoe-care',
    subcategorySlug: 'sneaker-care',
    price: 250,
    salePrice: 220,
    compareAtPrice: 280,
    stock: 150,
    rating: 5.0,
    numReviews: 68,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    description: 'Kick Whito is specially formulated for restoring brilliant white shine to leather, canvas, and rubber soles of sneakers and sports shoes. Removes tough scuffs and yellowing instantly without ruining material.',
    shortDescription: 'Instant white sneaker restorer and stain remover sponge applicator.'
  },
  {
    _id: 'prod-2',
    name: 'Kick Joggers & Canvas Cleaner Solution',
    slug: 'kick-joggers-canvas-cleaner',
    sku: 'KICK-JOG-150',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-1', name: 'Sneaker Care', slug: 'sneaker-care', imageUrl: '/Shoe Care.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-1', name: 'Sneaker Care', slug: 'sneaker-care' },
    categorySlug: 'shoe-care',
    subcategorySlug: 'sneaker-care',
    price: 260,
    salePrice: 240,
    compareAtPrice: 290,
    stock: 100,
    rating: 4.8,
    numReviews: 38,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    description: 'Deep foam action cleaner specifically engineered for sports joggers, mesh sneakers, and canvas footwear.',
    shortDescription: 'Active foam cleanser for sports joggers & canvas shoes.'
  },
  {
    _id: 'prod-3',
    name: 'Kick Super Liquid Shoe Polish',
    slug: 'kick-super-liquid-shoe-polish',
    sku: 'KICK-SP-BLACK',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-2', name: 'Leather Care', slug: 'leather-care', imageUrl: '/liquid shoe polish.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-2', name: 'Leather Care', slug: 'leather-care' },
    categorySlug: 'shoe-care',
    subcategorySlug: 'leather-care',
    price: 250,
    salePrice: 220,
    compareAtPrice: 280,
    stock: 120,
    rating: 4.7,
    numReviews: 45,
    status: 'published',
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    description: 'Premium quick-drying liquid shoe polish enriched with natural carnauba wax for deep shine and nourishment.',
    shortDescription: 'Instant high-shine wax liquid polish for leather shoes.'
  },
  {
    _id: 'prod-4',
    name: 'Kick Super Shoe Polish Wax Tin 50g',
    slug: 'kick-super-shoe-polish-wax-tin-50g',
    sku: 'KICK-WAX-50G',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-2', name: 'Leather Care', slug: 'leather-care', imageUrl: '/liquid shoe polish.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-2', name: 'Leather Care', slug: 'leather-care' },
    categorySlug: 'shoe-care',
    subcategorySlug: 'leather-care',
    price: 240,
    salePrice: 220,
    compareAtPrice: 260,
    stock: 180,
    rating: 4.9,
    numReviews: 52,
    status: 'published',
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    description: 'Traditional solid wax shoe polish tin for military-grade spit shine and deep leather nourishing.',
    shortDescription: 'Classic 50g solid wax shoe polish tin for formal shoes.'
  },
  {
    _id: 'prod-5',
    name: 'Kick Instant Shoe Shiner Sponge',
    slug: 'kick-instant-shoe-shiner-sponge',
    sku: 'KICK-SPONGE-INST',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-2', name: 'Leather Care', slug: 'leather-care', imageUrl: '/liquid shoe polish.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-2', name: 'Leather Care', slug: 'leather-care' },
    categorySlug: 'shoe-care',
    subcategorySlug: 'leather-care',
    price: 220,
    salePrice: 190,
    compareAtPrice: 240,
    stock: 200,
    rating: 4.9,
    numReviews: 60,
    status: 'published',
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    description: 'Compact travel sponge pre-impregnated with silicone oils. Restores instant glossy finish to leather shoes.',
    shortDescription: 'Mess-free travel silicone shiner sponge.'
  },
  {
    _id: 'prod-6',
    name: 'Kick Horsehair Shoe Polish Brush',
    slug: 'kick-horsehair-shoe-polish-brush',
    sku: 'KICK-BRUSH-WOOD',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-3', name: 'Cleaners & Brushes', slug: 'cleaners', imageUrl: '/Shoe Care.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-3', name: 'Cleaners & Brushes', slug: 'cleaners' },
    categorySlug: 'shoe-care',
    subcategorySlug: 'cleaners',
    price: 350,
    salePrice: 290,
    compareAtPrice: 380,
    stock: 60,
    rating: 4.7,
    numReviews: 19,
    status: 'published',
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    description: 'Ergonomic wooden shoe brush crafted with natural horsehair bristles for optimal wax distribution.',
    shortDescription: 'Natural horsehair wooden shoe buffing brush.'
  },
  {
    _id: 'prod-7',
    name: 'Kick Foot & Shoe Deodorizer Spray',
    slug: 'kick-foot-shoe-deodorizer-spray',
    sku: 'KICK-DEO-150',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', imageUrl: '/Shoe Care.png' },
    subcategoryId: { _id: 'sub-3', name: 'Cleaners & Brushes', slug: 'cleaners', imageUrl: '/Shoe Care.png' },
    category: { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care' },
    subcategory: { _id: 'sub-3', name: 'Cleaners & Brushes', slug: 'cleaners' },
    categorySlug: 'shoe-care',
    subcategorySlug: 'cleaners',
    price: 290,
    salePrice: 250,
    compareAtPrice: 320,
    stock: 80,
    rating: 4.6,
    numReviews: 14,
    status: 'published',
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    description: 'Antibacterial footwear spray that neutralizes odor-causing bacteria instantly for 24-hour freshness.',
    shortDescription: '24-hour odor defense spray for shoes and feet.'
  },

  // Laundry Care Products
  {
    _id: 'prod-8',
    name: 'Kick Bleach Liquid Ultra Clean',
    slug: 'kick-bleach-liquid-ultra-clean',
    sku: 'KICK-BLC-500',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', imageUrl: '/laundry Care.png' },
    subcategoryId: { _id: 'sub-5', name: 'Bleach Liquid', slug: 'bleach-liquid', imageUrl: '/laundry Care.png' },
    category: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care' },
    subcategory: { _id: 'sub-5', name: 'Bleach Liquid', slug: 'bleach-liquid' },
    categorySlug: 'laundry-care',
    subcategorySlug: 'bleach-liquid',
    price: 250,
    salePrice: 220,
    compareAtPrice: 280,
    stock: 150,
    rating: 4.9,
    numReviews: 74,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    description: 'Kick Bleach Liquid delivers powerful stain removal, whitening, and sanitization for fabrics and surfaces.',
    shortDescription: 'Multi-purpose whitening and disinfectant liquid bleach.'
  },
  {
    _id: 'prod-9',
    name: 'Kick Fabric Blue Whitener Liquid',
    slug: 'kick-fabric-blue-whitener-liquid',
    sku: 'KICK-BLUE-250',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', imageUrl: '/laundry Care.png' },
    subcategoryId: { _id: 'sub-6', name: 'Fabric Whitener', slug: 'fabric-whitener', imageUrl: '/whitner bleach.png' },
    category: { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care' },
    subcategory: { _id: 'sub-6', name: 'Fabric Whitener', slug: 'fabric-whitener' },
    categorySlug: 'laundry-care',
    subcategorySlug: 'fabric-whitener',
    price: 180,
    salePrice: 160,
    compareAtPrice: 200,
    stock: 110,
    rating: 4.8,
    numReviews: 22,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
    description: 'Optical brightener for white clothes. Eliminates yellow tints, leaving a radiant blue tint shine.',
    shortDescription: 'Optical blue whitener for brilliant white clothes.'
  },

  // Home Cleaning
  {
    _id: 'prod-10',
    name: 'Kick Perfumed White Phenyle (Lavender)',
    slug: 'kick-perfumed-white-phenyle-lavender',
    sku: 'KICK-PHY-1000',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-3', name: 'Home Cleaning', slug: 'home-cleaning', imageUrl: '/Home Cleaning.png' },
    subcategoryId: { _id: 'sub-8', name: 'Perfumed Phenyle', slug: 'phenyle', imageUrl: '/Home Cleaning.png' },
    category: { _id: 'cat-3', name: 'Home Cleaning', slug: 'home-cleaning' },
    subcategory: { _id: 'sub-8', name: 'Perfumed Phenyle', slug: 'phenyle' },
    categorySlug: 'home-cleaning',
    subcategorySlug: 'phenyle',
    price: 280,
    salePrice: 240,
    compareAtPrice: 320,
    stock: 90,
    rating: 4.8,
    numReviews: 32,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
    description: 'High-power disinfectant fragrant white phenyle for germ-free sparkling floors.',
    shortDescription: 'Fragrant floor disinfectant phenyle liquid.'
  },

  // Dish Care
  {
    _id: 'prod-11',
    name: 'Kick Lemon Power Dishwash Liquid',
    slug: 'kick-lemon-power-dishwash-liquid',
    sku: 'KICK-DW-500',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-4', name: 'Dish Care', slug: 'dish-care', imageUrl: '/dish care.png' },
    subcategoryId: { _id: 'sub-10', name: 'Dishwash Liquid', slug: 'dishwash-liquid', imageUrl: '/dish care.png' },
    category: { _id: 'cat-4', name: 'Dish Care', slug: 'dish-care' },
    subcategory: { _id: 'sub-10', name: 'Dishwash Liquid', slug: 'dishwash-liquid' },
    categorySlug: 'dish-care',
    subcategorySlug: 'dishwash-liquid',
    price: 240,
    salePrice: 210,
    compareAtPrice: 270,
    stock: 140,
    rating: 4.9,
    numReviews: 41,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
    description: 'Tough grease-cutting dishwashing liquid infused with real lemon oil.',
    shortDescription: 'Ultra concentrated lemon grease-cutting dishwash gel.'
  },

  // Washroom Cleaning
  {
    _id: 'prod-12',
    name: 'Kick Heavy Duty Liquid Drain Opener',
    slug: 'kick-heavy-duty-liquid-drain-opener',
    sku: 'KICK-DRAIN-500',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-5', name: 'Washroom Cleaning', slug: 'washroom-cleaning', imageUrl: '/washroom cleaning.png' },
    subcategoryId: { _id: 'sub-12', name: 'Drain Opener', slug: 'drain-opener', imageUrl: '/kick drain opener.png' },
    category: { _id: 'cat-5', name: 'Washroom Cleaning', slug: 'washroom-cleaning' },
    subcategory: { _id: 'sub-12', name: 'Drain Opener', slug: 'drain-opener' },
    categorySlug: 'washroom-cleaning',
    subcategorySlug: 'drain-opener',
    price: 320,
    salePrice: 280,
    compareAtPrice: 360,
    stock: 85,
    rating: 4.9,
    numReviews: 57,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    description: 'Fast acting caustic drain opener dissolves hair, grease, and soap scum in minutes.',
    shortDescription: 'Fast acting clog dissolver for sink & bathroom pipes.'
  },

  // Mosquito Protection
  {
    _id: 'prod-13',
    name: 'Kick Mosquito Vaporizer Machine & Liquid Refill',
    slug: 'kick-mosquito-vaporizer-machine-refill',
    sku: 'KICK-MOSQ-SET',
    brand: 'Kick Home Care',
    categoryId: { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection', imageUrl: '/mosquito protection.png' },
    subcategoryId: { _id: 'sub-14', name: 'Machine & Refills', slug: 'machine-refills', imageUrl: '/mosquito protection.png' },
    category: { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection' },
    subcategory: { _id: 'sub-14', name: 'Machine & Refills', slug: 'machine-refills' },
    categorySlug: 'mosquito-protection',
    subcategorySlug: 'machine-refills',
    price: 350,
    salePrice: 310,
    compareAtPrice: 400,
    stock: 120,
    rating: 4.8,
    numReviews: 29,
    status: 'published',
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    description: '60 nights continuous protection against mosquitoes and dengue vectors.',
    shortDescription: 'Electric mosquito heater machine with 45ml liquid refill.'
  }
];

function getMemoryProducts() {
  if (!global.memoryProducts || !Array.isArray(global.memoryProducts) || global.memoryProducts.length === 0) {
    global.memoryProducts = [...DEFAULT_STOREFRONT_PRODUCTS];
  }
  return global.memoryProducts;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get('category');
  const subcategorySlug = searchParams.get('subcategory');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const bestSeller = searchParams.get('bestseller');
  const sort = searchParams.get('sort');
  const limitParam = searchParams.get('limit');

  try {
    const db = await connectDB();

    if (db && mongoose.connection.readyState === 1) {
      let query = {
        $and: [
          { status: 'published' },
          { isActive: { $ne: false } }
        ]
      };

      if (categorySlug && categorySlug !== 'all') {
        const categoryObj = await Category.findOne({
          $or: [
            { slug: categorySlug },
            { name: categorySlug }
          ]
        }).lean();

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

      if (subcategorySlug && subcategorySlug !== 'all') {
        const subcategoryObj = await Subcategory.findOne({
          $or: [
            { slug: subcategorySlug },
            { name: subcategorySlug }
          ]
        }).lean();

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

      const rawProducts = await dbQuery.lean();
      const products = rawProducts.map((p) => ({
        ...p,
        category: p.category || p.categoryId,
        subcategory: p.subcategory || p.subcategoryId,
        categorySlug: p.categorySlug || p.categoryId?.slug,
        subcategorySlug: p.subcategorySlug || p.subcategoryId?.slug
      }));

      return NextResponse.json({
        success: true,
        count: products.length,
        products
      });
    }

    // Memory fallback when MongoDB is not connected
    let prods = getMemoryProducts();

    if (categorySlug && categorySlug !== 'all') {
      prods = prods.filter(
        (p) =>
          p.categorySlug === categorySlug ||
          p.category?.slug === categorySlug ||
          p.categoryId?.slug === categorySlug ||
          p.category === categorySlug
      );
    }

    if (subcategorySlug && subcategorySlug !== 'all') {
      prods = prods.filter(
        (p) =>
          p.subcategorySlug === subcategorySlug ||
          p.subcategory?.slug === subcategorySlug ||
          p.subcategoryId?.slug === subcategorySlug ||
          p.subcategory === subcategorySlug
      );
    }

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.shortDescription?.toLowerCase().includes(term)
      );
    }

    if (featured === 'true') {
      prods = prods.filter((p) => p.isFeatured);
    }

    if (bestSeller === 'true') {
      prods = prods.filter((p) => p.isBestSeller);
    }

    if (sort === 'price-low') {
      prods = [...prods].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === 'price-high') {
      prods = [...prods].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === 'rating') {
      prods = [...prods].sort((a, b) => (b.rating || 5) - (a.rating || 5));
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
    let prods = getMemoryProducts();
    if (categorySlug && categorySlug !== 'all') {
      prods = prods.filter(
        (p) =>
          p.categorySlug === categorySlug ||
          p.category?.slug === categorySlug ||
          p.categoryId?.slug === categorySlug
      );
    }
    return NextResponse.json({
      success: true,
      count: prods.length,
      products: prods
    });
  }
}
