import React from 'react';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import Product from '@/models/Product';
import CategoryClient from './CategoryClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

const CATEGORY_META = {
  'shoe-care': {
    name: 'Shoe Care',
    bannerImage: '/Shoe%20Main%20Category%20Banner.jpg.jpeg',
    tagline: 'Keep Your Shoes Looking Like New',
    description: 'Discover practical shoe care solutions designed to clean, protect and maintain your favorite footwear.'
  },
  'laundry-care': {
    name: 'Laundry Care',
    bannerImage: '/laundry Care.png',
    tagline: 'Brilliant Whites & Long-Lasting Fabric Freshness',
    description: 'Explore high performance bleach liquid, blue whitening agents, and fabric conditioners specially engineered for Pakistani cottons and fabrics.'
  },
  'home-cleaning': {
    name: 'Home Cleaning',
    bannerImage: '/Home Cleaning.png',
    tagline: 'Sparkling Surfaces & Fresh Lavender Aroma',
    description: 'All-purpose surface cleaners, perfumed floor phenyle, and descaling bathroom power gels designed to eliminate 99.9% household germs.'
  },
  'dish-care': {
    name: 'Dish Care',
    bannerImage: '/dish care.png',
    tagline: 'Tough Grease Cutting with Citrus Power',
    description: 'High-active foam dishwashing liquids enriched with lemon extract to lift baked-on oil and stubborn curry stains with a single drop.'
  },
  'washroom-cleaning': {
    name: 'Washroom Cleaning',
    bannerImage: '/washroom cleaning.png',
    tagline: 'Heavy Duty Clog Removal & Limescale Descaling',
    description: 'Professional-grade drain openers, toilet gels, and bathroom cleaners that melt hair, soap scum, and grease in blocked sink and floor pipes.'
  },
  'mosquito-protection': {
    name: 'Mosquito Protection',
    bannerImage: '/mosquito protection.png',
    tagline: 'Reliable Defense Against Mosquitoes & Dengue',
    description: 'Electric liquid refills, mosquito coils, and crawling insect sprays providing 60 nights of continuous family protection.'
  }
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const fallback = CATEGORY_META[slug] || {
    name: (slug || '').replace(/-/g, ' '),
    bannerImage: '/kick%20logo.png',
    tagline: 'Authentic Kick Home Care Products',
    description: `Browse premium home-care solutions formulated for ${(slug || '').replace(/-/g, ' ')}.`
  };

  try {
    await connectDB();
    const dbCategory = await Category.findOne({ slug }).lean();
    const categoryName = dbCategory?.name || fallback.name;
    const title = dbCategory?.seoTitle || `${categoryName} Products | Buy Online in Pakistan | Kick Home Care`;
    const description = dbCategory?.seoDescription || dbCategory?.description || fallback.description;
    const image = dbCategory?.imageUrl || dbCategory?.image || fallback.bannerImage;
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
            alt: `${categoryName} Products - Kick Home Care`,
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
    const title = `${fallback.name} Products | Kick Home Care`;
    return {
      title,
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

  const currentMeta = CATEGORY_META[slug] || {
    name: (slug || '').replace(/-/g, ' '),
    bannerImage: '/Shoe Care.png',
    tagline: 'Authentic Kick Home Care Products',
    description: `Browse premium home-care solutions formulated for ${(slug || '').replace(/-/g, ' ')}.`
  };

  let initialProducts = [];
  let initialSubcategories = [];

  try {
    await connectDB();
    const dbCategory = await Category.findOne({ slug }).lean();

    if (dbCategory) {
      currentMeta.name = dbCategory.name || currentMeta.name;
      if (dbCategory.description) currentMeta.description = dbCategory.description;
      if (dbCategory.imageUrl || dbCategory.image) {
        currentMeta.bannerImage = dbCategory.imageUrl || dbCategory.image;
      }

      // Fetch products for this category
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

      initialProducts = JSON.parse(JSON.stringify(rawProducts));
      initialSubcategories = JSON.parse(JSON.stringify(rawSubcategories));
    }
  } catch (err) {
    console.error('Error fetching category server data:', err);
  }

  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  // CollectionPage Structured Data
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

  // Breadcrumb schema
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
