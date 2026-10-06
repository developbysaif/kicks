import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { getAuthUser } from '@/lib/jwt';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Article ID is required' }, { status: 400 });
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

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    const updateFields = {};
    if (title) updateFields.title = title.trim();

    if (customSlug && customSlug !== existingPost.slug) {
      const sanitized = slugify(customSlug, { lower: true, strict: true });
      const duplicate = await BlogPost.findOne({ slug: sanitized, _id: { $ne: id } });
      updateFields.slug = duplicate ? `${sanitized}-${Date.now().toString().slice(-4)}` : sanitized;
    }

    if (excerpt !== undefined) updateFields.excerpt = excerpt.trim();
    if (content !== undefined) updateFields.content = content;
    if (coverImageUrl !== undefined) updateFields.coverImageUrl = coverImageUrl;
    if (category !== undefined) updateFields.category = category.trim();
    if (authorName !== undefined) updateFields.authorName = authorName.trim();
    if (readTime !== undefined) updateFields.readTime = readTime.trim();

    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
    }

    if (seoTitle !== undefined) updateFields.seoTitle = seoTitle.trim();
    if (seoDescription !== undefined) updateFields.seoDescription = seoDescription.trim();

    if (status) {
      updateFields.status = status;
      if (status === 'published' && !existingPost.publishedAt) {
        updateFields.publishedAt = new Date();
      }
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updateFields, { new: true });

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      post: updatedPost
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Article ID is required' }, { status: 400 });
    }

    await connectDB();
    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
