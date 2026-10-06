import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { INITIAL_BLOG_POSTS } from '@/lib/blogData';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    let posts = [];
    let dbConnected = false;

    try {
      await connectDB();
      dbConnected = true;

      let query = { status: 'published' };

      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (tag) {
        query.tags = { $in: [tag] };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      let q = BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 });
      if (limit > 0) q = q.limit(limit);
      posts = await q.lean();

      // If DB has no blog posts yet, seed the default initial posts
      if (posts.length === 0 && (!category || category === 'all') && !search && !tag) {
        try {
          const count = await BlogPost.countDocuments();
          if (count === 0) {
            await BlogPost.insertMany(INITIAL_BLOG_POSTS.map(p => ({
              ...p,
              _id: undefined
            })));
            posts = await BlogPost.find({ status: 'published' }).sort({ publishedAt: -1 }).lean();
          }
        } catch (seedErr) {
          console.warn('Auto-seed blog posts skipped:', seedErr.message);
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB connection fallback for blogs:', dbErr.message);
    }

    // If still empty or DB offline, filter from INITIAL_BLOG_POSTS fallback
    if (!posts || posts.length === 0) {
      let fallback = INITIAL_BLOG_POSTS.filter(p => p.status === 'published');
      if (category && category !== 'all') {
        fallback = fallback.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (tag) {
        fallback = fallback.filter(p => p.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        fallback = fallback.filter(p =>
          p.title.toLowerCase().includes(s) ||
          p.excerpt.toLowerCase().includes(s) ||
          p.content.toLowerCase().includes(s)
        );
      }
      posts = limit > 0 ? fallback.slice(0, limit) : fallback;
    }

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message, posts: INITIAL_BLOG_POSTS },
      { status: 500 }
    );
  }
}
