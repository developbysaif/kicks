import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { INITIAL_BLOG_POSTS } from '@/lib/blogData';
import BlogDetailClient from './BlogDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

async function getPostData(slug) {
  try {
    await connectDB();
    const dbPost = await BlogPost.findOne({ slug, status: 'published' }).lean();

    if (dbPost) {
      const related = await BlogPost.find({
        slug: { $ne: slug },
        status: 'published',
      })
        .limit(3)
        .lean();

      return {
        post: JSON.parse(JSON.stringify(dbPost)),
        relatedPosts: JSON.parse(JSON.stringify(related)),
      };
    }
  } catch (err) {
    console.error('Error fetching blog from DB:', err);
  }

  // Fallback to initial blog data
  const fallbackPost = INITIAL_BLOG_POSTS.find((p) => p.slug === slug);
  if (fallbackPost) {
    const fallbackRelated = INITIAL_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
    return {
      post: fallbackPost,
      relatedPosts: fallbackRelated,
    };
  }

  return { post: null, relatedPosts: [] };
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { post } = await getPostData(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Kick Care Journal',
      description: 'The requested home care guide or blog post was not found.',
    };
  }

  const title = post.seoTitle || `${post.title} | Kick Home Care Journal`;
  const description =
    post.seoDescription ||
    post.excerpt ||
    'Expert tips, cleaning methods, and household care guides from Kick Home Care.';
  const image = post.coverImageUrl || '/kick%20logo.png';
  const canonical = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'article',
      locale: 'en_PK',
      url: canonical,
      siteName: 'Kick Home Care',
      title,
      description,
      publishedTime: post.publishedAt,
      authors: [post.authorName || 'Kick Home Care'],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
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
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const { post, relatedPosts } = await getPostData(slug);

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  // Article / BlogPosting Schema
  const articleSchema = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.seoDescription,
        image: post.coverImageUrl ? [post.coverImageUrl] : [`${SITE_URL}/kick%20logo.png`],
        datePublished: post.publishedAt || new Date().toISOString(),
        dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: post.authorName || 'Kick Care Experts',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Kick Home Care',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/kick%20logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      }
    : null;

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post?.title || slug,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogDetailClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
