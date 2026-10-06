import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Review from '@/models/Review';
import ProductDetailsClient from './ProductDetailsClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    await connectDB();
    const product = await Product.findOne({ slug })
      .populate('categoryId', 'name slug')
      .lean();

    if (!product) {
      return {
        title: 'Product Not Found | Kick Home Care',
        description: 'The requested product could not be found.',
      };
    }

    const price = product.salePrice > 0 ? product.salePrice : product.price;
    const title = `${product.name} - Buy Online in Pakistan | Kick Home Care`;
    const description =
      product.shortDescription ||
      product.description?.replace(/<[^>]+>/g, '').slice(0, 160) ||
      `Buy genuine ${product.name} at Rs. ${price} from Kick Home Care. Nationwide delivery across Pakistan.`;
    const image = product.images?.[0] || '/kick%20logo.png';
    const canonical = `${SITE_URL}/product/${product.slug}`;

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
        images: [
          {
            url: image,
            width: 800,
            height: 800,
            alt: product.name,
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
  } catch (error) {
    return {
      title: 'Product | Kick Home Care',
      description: 'Kick Home Care - Quality home cleaning and shoe care products.',
    };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = params;

  let initialProduct = null;
  let initialReviews = [];
  let initialRelatedProducts = [];

  try {
    await connectDB();
    const rawProduct = await Product.findOne({ slug })
      .populate('categoryId', 'name slug')
      .lean();

    if (rawProduct) {
      initialProduct = JSON.parse(JSON.stringify(rawProduct));

      // Fetch reviews
      const reviews = await Review.find({ productId: rawProduct._id, status: 'approved' })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      initialReviews = JSON.parse(JSON.stringify(reviews));

      // Fetch related products from same category
      if (rawProduct.categoryId) {
        const related = await Product.find({
          categoryId: rawProduct.categoryId._id || rawProduct.categoryId,
          _id: { $ne: rawProduct._id },
          isActive: true
        })
          .populate('categoryId', 'name slug')
          .limit(4)
          .lean();
        initialRelatedProducts = JSON.parse(JSON.stringify(related));
      }
    }
  } catch (error) {
    console.error('Error fetching product in Server Component:', error);
  }

  const price = initialProduct?.salePrice > 0 ? initialProduct.salePrice : initialProduct?.price || 0;
  const canonicalUrl = `${SITE_URL}/product/${slug}`;

  // Structured Data (schema.org/Product)
  const productSchema = initialProduct ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: initialProduct.name,
    image: initialProduct.images || ['/kick%20logo.png'],
    description: initialProduct.shortDescription || initialProduct.description?.slice(0, 200),
    sku: initialProduct.sku || slug,
    brand: {
      '@type': 'Brand',
      name: initialProduct.brand || 'Kick Home Care'
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'PKR',
      price: price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: (initialProduct.stock > 0 || !initialProduct.trackInventory)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Kick Home Care'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: initialProduct.ratingAvg || initialProduct.rating || 5.0,
      reviewCount: initialProduct.ratingCount || (initialReviews.length > 0 ? initialReviews.length : 15)
    }
  } : null;

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
        name: initialProduct?.name || slug,
        item: canonicalUrl
      }
    ]
  };

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailsClient
        slug={slug}
        initialProduct={initialProduct}
        initialReviews={initialReviews}
        initialRelatedProducts={initialRelatedProducts}
      />
    </>
  );
}
