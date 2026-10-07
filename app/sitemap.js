import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import BlogPost from '@/models/BlogPost';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com').replace(/\/$/, '');
  const now = new Date();

  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/shop/shoe-care`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  try {
    await connectDB();

    // 1. Categories
    const categories = await Category.find({
      $or: [{ isActive: true }, { status: 'published' }]
    }).select('slug updatedAt').lean();

    const categoryRoutes = [];
    categories.forEach((cat) => {
      if (cat.slug) {
        categoryRoutes.push({
          url: `${baseUrl}/category/${cat.slug}`,
          lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
        categoryRoutes.push({
          url: `${baseUrl}/shop/${cat.slug}`,
          lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });

    // 2. Subcategories
    const subcategories = await Subcategory.find({
      $or: [{ isActive: true }, { status: 'published' }]
    }).populate('categoryId', 'slug').select('slug categoryId updatedAt').lean();

    const subcategoryRoutes = [];
    subcategories.forEach((sub) => {
      const parentSlug = sub.categoryId?.slug;
      if (parentSlug && sub.slug) {
        subcategoryRoutes.push({
          url: `${baseUrl}/shop/${parentSlug}/${sub.slug}`,
          lastModified: sub.updatedAt ? new Date(sub.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.75,
        });
      }
    });

    // 3. Products
    const products = await Product.find({
      $or: [{ isActive: true }, { status: 'published' }]
    }).select('slug updatedAt').lean();

    const productRoutes = products
      .filter((p) => Boolean(p.slug))
      .map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));

    // 4. Blogs
    const blogs = await BlogPost.find({
      status: 'published'
    }).select('slug updatedAt publishedAt').lean();

    const blogRoutes = blogs
      .filter((b) => Boolean(b.slug))
      .map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : (b.publishedAt ? new Date(b.publishedAt) : now),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...subcategoryRoutes,
      ...productRoutes,
      ...blogRoutes,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticRoutes;
  }
}
