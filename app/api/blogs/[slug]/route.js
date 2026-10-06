import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { INITIAL_BLOG_POSTS } from '@/lib/blogData';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    let post = null;
    let relatedPosts = [];

    try {
      await connectDB();
      post = await BlogPost.findOne({ slug, status: 'published' }).lean();

      if (post) {
        relatedPosts = await BlogPost.find({
          _id: { $ne: post._id },
          status: 'published',
          $or: [
            { category: post.category },
            { tags: { $in: post.tags || [] } }
          ]
        })
          .limit(3)
          .lean();

        if (relatedPosts.length < 3) {
          const fillers = await BlogPost.find({
            _id: { $ne: post._id, $nin: relatedPosts.map(r => r._id) },
            status: 'published'
          })
            .limit(3 - relatedPosts.length)
            .lean();
          relatedPosts = [...relatedPosts, ...fillers];
        }
      }
    } catch (dbErr) {
      console.warn('DB error in blog slug route:', dbErr.message);
    }

    // Fallback to static blog data if not found in DB
    if (!post) {
      post = INITIAL_BLOG_POSTS.find(p => p.slug === slug);
      if (post) {
        relatedPosts = INITIAL_BLOG_POSTS.filter(p => p.slug !== slug && p.status === 'published').slice(0, 3);
      }
    }

    if (!post) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      post,
      relatedPosts
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
