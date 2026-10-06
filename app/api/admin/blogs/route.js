import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { getAuthUser } from '@/lib/jwt';
import slugify from 'slugify';
import { INITIAL_BLOG_POSTS } from '@/lib/blogData';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let posts = await BlogPost.find(query).sort({ createdAt: -1 }).lean();

    // If database has 0 blogs, seed the initial ones
    if (posts.length === 0 && !search && (!status || status === 'all')) {
      const count = await BlogPost.countDocuments();
      if (count === 0) {
        await BlogPost.insertMany(INITIAL_BLOG_POSTS.map(p => ({ ...p, _id: undefined })));
        posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
      }
    }

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImageUrl,
      category,
      authorName,
      readTime,
      tags,
      seoTitle,
      seoDescription,
      status
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Article title and content are required' },
        { status: 400 }
      );
    }

    let finalSlug = customSlug
      ? slugify(customSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    // Ensure unique slug
    let existing = await BlogPost.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const newPost = await BlogPost.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: (excerpt || '').trim(),
      content,
      coverImageUrl: coverImageUrl || '/shoes cleaning.jpg.jpeg',
      category: (category || 'Shoe Care').trim(),
      authorName: (authorName || 'Kick Care Experts').trim(),
      readTime: (readTime || '4 min read').trim(),
      tags: parsedTags,
      seoTitle: (seoTitle || title).trim(),
      seoDescription: (seoDescription || excerpt || '').trim(),
      status: status || 'published',
      publishedAt: status === 'published' ? new Date() : null
    });

    return NextResponse.json({
      success: true,
      message: 'Article published successfully',
      post: newPost
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
