import React from 'react';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import Product from '@/models/Product';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

const CATEGORY_META = {
  'shoe-care': {
    name: 'Shoe Care',
    bannerImage: '/shoe-care-banner.jpg',
    tagline: 'Keep Your Shoes Looking Like New',
    description: 'Discover practical shoe care solutions designed to clean, protect and maintain your favorite footwear.'
  },
  'laundry-care': {
    name: 'Laundry Care',
    bannerImage: '/laundry-care-banner.png',
    tagline: 'Brilliant Whites & Long-Lasting Fabric Freshness',
    description: 'Explore high performance bleach liquid, blue whitening agents, and fabric conditioners specially engineered for Pakistani cottons and fabrics.'
  },
  'home-cleaning': {
    name: 'Home Cleaning',
    bannerImage: '/home-cleaning-banner.jpg',
    tagline: 'Sparkling Surfaces & Fresh Lavender Aroma',
    description: 'All-purpose surface cleaners, perfumed floor phenyle, and descaling bathroom power gels designed to eliminate 99.9% household germs.'
  },
  'dish-care': {
    name: 'Dish Care',
    bannerImage: '/dish-care-banner.jpg',
    tagline: 'Tough Grease Cutting with Citrus Power',
    description: 'High-active foam dishwashing liquids enriched with lemon extract to lift baked-on oil and stubborn curry stains with a single drop.'
  },
  'washroom-cleaning': {
    name: 'Washroom Cleaning',
    bannerImage: '/washroom-cleaning-banner.jpg',
    tagline: 'Heavy Duty Clog Removal & Limescale Descaling',
    description: 'Professional-grade drain openers, toilet gels, and bathroom cleaners that melt hair, soap scum, and grease in blocked sink and floor pipes.'
  },
  'mosquito-protection': {
    name: 'Mosquito Protection',
    bannerImage: '/mosquito-protection-banner.jpg',
    tagline: 'Reliable Defense Against Mosquitoes & Dengue',
    description: 'Electric liquid refills, mosquito coils, and crawling insect sprays providing 60 nights of continuous family protection.'
  }
};

const DEFAULT_CATEGORY_PRODUCTS = {
  'shoe-care': [
    {
      _id: 'prod-1',
      name: 'Kick Whito - White Sneaker & Joggers Cleaner',
      slug: 'kick-whito-white-sneaker-cleaner',
      sku: 'KICK-WHITO-100',
      brand: 'Kick Home Care',
      price: 250,
      salePrice: 220,
      stock: 150,
      rating: 5.0,
      numReviews: 68,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
      description: 'Kick Whito is specially formulated for restoring brilliant white shine to sneakers and shoes.',
      shortDescription: 'Instant white sneaker restorer and stain remover.'
    },
    {
      _id: 'prod-2',
      name: 'Kick Joggers & Canvas Cleaner Solution',
      slug: 'kick-joggers-canvas-cleaner',
      sku: 'KICK-JOG-150',
      brand: 'Kick Home Care',
      price: 260,
      salePrice: 240,
      stock: 100,
      rating: 4.8,
      numReviews: 38,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
      description: 'Deep foam action cleaner specifically engineered for sports joggers and canvas shoes.',
      shortDescription: 'Active foam cleanser for sports joggers.'
    },
    {
      _id: 'prod-3',
      name: 'Kick Super Liquid Shoe Polish',
      slug: 'kick-super-liquid-shoe-polish',
      sku: 'KICK-SP-BLACK',
      brand: 'Kick Home Care',
      price: 250,
      salePrice: 220,
      stock: 120,
      rating: 4.7,
      numReviews: 45,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
      description: 'Premium quick-drying liquid shoe polish enriched with natural carnauba wax.',
      shortDescription: 'Instant high-shine wax liquid polish for leather shoes.'
    }
  ],
  'laundry-care': [
    {
      _id: 'prod-8',
      name: 'Kick Bleach Liquid Ultra Clean',
      slug: 'kick-bleach-liquid-ultra-clean',
      sku: 'KICK-BLC-500',
      brand: 'Kick Home Care',
      price: 250,
      salePrice: 220,
      stock: 150,
      rating: 4.9,
      numReviews: 74,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
      description: 'Kick Bleach Liquid delivers powerful stain removal, whitening, and sanitization.',
      shortDescription: 'Multi-purpose whitening and disinfectant liquid bleach.'
    },
    {
      _id: 'prod-9',
      name: 'Kick Fabric Blue Whitener Liquid',
      slug: 'kick-fabric-blue-whitener-liquid',
      sku: 'KICK-BLUE-250',
      brand: 'Kick Home Care',
      price: 180,
      salePrice: 160,
      stock: 110,
      rating: 4.8,
      numReviews: 22,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
      description: 'Optical brightener for white clothes. Eliminates yellow tints, leaving a radiant blue tint shine.',
      shortDescription: 'Optical blue whitener for brilliant white clothes.'
    }
  ],
  'home-cleaning': [
    {
      _id: 'prod-10',
      name: 'Kick Perfumed White Phenyle (Lavender)',
      slug: 'kick-perfumed-white-phenyle-lavender',
      sku: 'KICK-PHY-1000',
      brand: 'Kick Home Care',
      price: 280,
      salePrice: 240,
      stock: 90,
      rating: 4.8,
      numReviews: 32,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
      description: 'High-power disinfectant fragrant white phenyle for germ-free sparkling floors.',
      shortDescription: 'Fragrant floor disinfectant phenyle liquid.'
    }
  ],
  'dish-care': [
    {
      _id: 'prod-11',
      name: 'Kick Lemon Power Dishwash Liquid',
      slug: 'kick-lemon-power-dishwash-liquid',
      sku: 'KICK-DW-500',
      brand: 'Kick Home Care',
      price: 240,
      salePrice: 210,
      stock: 140,
      rating: 4.9,
      numReviews: 41,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
      description: 'Tough grease-cutting dishwashing liquid infused with real lemon oil.',
      shortDescription: 'Ultra concentrated lemon grease-cutting dishwash gel.'
    }
  ],
  'washroom-cleaning': [
    {
      _id: 'prod-12',
      name: 'Kick Heavy Duty Liquid Drain Opener',
      slug: 'kick-heavy-duty-liquid-drain-opener',
      sku: 'KICK-DRAIN-500',
      brand: 'Kick Home Care',
      price: 320,
      salePrice: 280,
      stock: 85,
      rating: 4.9,
      numReviews: 57,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
      description: 'Fast acting caustic drain opener dissolves hair, grease, and soap scum in minutes.',
      shortDescription: 'Fast acting clog dissolver for sink & bathroom pipes.'
    }
  ],
  'mosquito-protection': [
    {
      _id: 'prod-13',
      name: 'Kick Mosquito Vaporizer Machine & Liquid Refill',
      slug: 'kick-mosquito-vaporizer-machine-refill',
      sku: 'KICK-MOSQ-SET',
      brand: 'Kick Home Care',
      price: 350,
      salePrice: 310,
      stock: 120,
      rating: 4.8,
      numReviews: 29,
      status: 'published',
      isActive: true,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
      description: '60 nights continuous protection against mosquitoes and dengue vectors.',
      shortDescription: 'Electric mosquito heater machine with 45ml liquid refill.'
    }
  ]
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const fallback = CATEGORY_META[slug] || {
    name: (slug || '').replace(/-/g, ' '),
    bannerImage: '/shop-all-banner.jpg',
    tagline: 'Authentic Kick Home Care Products',
    description: `Browse premium home-care solutions formulated for ${(slug || '').replace(/-/g, ' ')}.`
  };

  try {
    const db = await connectDB();
    let title = `${fallback.name} Products | Buy Online in Pakistan | Kick Home Care`;
    let description = fallback.description;
    let image = fallback.bannerImage;

    if (db && mongoose.connection.readyState === 1) {
      const dbCategory = await Category.findOne({ slug }).lean();
      if (dbCategory) {
        const categoryName = dbCategory.name || fallback.name;
        title = dbCategory.seoTitle || `${categoryName} Products | Buy Online in Pakistan | Kick Home Care`;
        description = dbCategory.seoDescription || dbCategory.description || fallback.description;
        image = dbCategory.bannerUrl || fallback.bannerImage;
      }
    }

    const canonical = `${SITE_URL}/category/${slug}`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'website',
        siteName: 'Kick Home Care',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: `${fallback.name} Products - Kick Home Care`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (err) {
    return {
      title: `${fallback.name} Products | Kick Home Care`,
      description: fallback.description,
      alternates: {
        canonical: `${SITE_URL}/category/${slug}`,
      },
    };
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = params;

  // Shoe care has dedicated landing at /shop/shoe-care
  if (slug === 'shoe-care') {
    redirect('/shop/shoe-care');
  }

  const currentMeta = {
    ...(CATEGORY_META[slug] || {
      name: (slug || '').replace(/-/g, ' '),
      bannerImage: '/shop-all-banner.jpg',
      tagline: 'Authentic Kick Home Care Products',
      description: `Browse premium home-care solutions formulated for ${(slug || '').replace(/-/g, ' ')}.`
    })
  };

  let initialProducts = DEFAULT_CATEGORY_PRODUCTS[slug] || [];
  let initialSubcategories = [];

  try {
    const db = await connectDB();

    if (db && mongoose.connection.readyState === 1) {
      const dbCategory = await Category.findOne({ slug }).lean();

      if (dbCategory) {
        currentMeta.name = dbCategory.name || currentMeta.name;
        if (dbCategory.description) currentMeta.description = dbCategory.description;
        if (dbCategory.bannerUrl) {
          currentMeta.bannerImage = dbCategory.bannerUrl;
        }

        const [rawProducts, rawSubcategories] = await Promise.all([
          Product.find({
            categoryId: dbCategory._id,
            isActive: true
          })
            .populate('categoryId', 'name slug')
            .populate('subcategoryId', 'name slug')
            .lean(),
          Subcategory.find({
            categoryId: dbCategory._id,
            isActive: true
          }).lean()
        ]);

        if (Array.isArray(rawProducts) && rawProducts.length > 0) {
          initialProducts = JSON.parse(JSON.stringify(rawProducts));
        }
        if (Array.isArray(rawSubcategories) && rawSubcategories.length > 0) {
          initialSubcategories = JSON.parse(JSON.stringify(rawSubcategories));
        }
      }
    }
  } catch (err) {
    console.error('Error fetching category server data:', err);
  }

  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${currentMeta.name} Products`,
    description: currentMeta.description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Kick Home Care',
      url: SITE_URL
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${SITE_URL}/shop`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentMeta.name,
        item: canonicalUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryClient
        slug={slug}
        currentMeta={currentMeta}
        initialProducts={initialProducts}
        initialSubcategories={initialSubcategories}
      />
    </>
  );
}
