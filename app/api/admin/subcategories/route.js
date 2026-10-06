import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subcategory from '@/models/Subcategory';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    let query = {};
    if (categoryId && categoryId !== 'all') {
      query.categoryId = categoryId;
    }

    const subcategories = await Subcategory.find(query)
      .populate('categoryId', 'name slug imageUrl')
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    // Attach product count
    const subcategoryIds = subcategories.map((s) => s._id);
    const prodCounts = await Product.aggregate([
      { $match: { subcategoryId: { $in: subcategoryIds } } },
      { $group: { _id: '$subcategoryId', count: { $sum: 1 } } }
    ]);

    const prodMap = {};
    prodCounts.forEach((p) => {
      prodMap[p._id.toString()] = p.count;
    });

    const enriched = subcategories.map((s) => ({
      ...s,
      productCount: prodMap[s._id.toString()] || 0
    }));

    return NextResponse.json({
      success: true,
      subcategories: enriched
    });
  } catch (error) {
    console.error('Admin subcategories GET error:', error);
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
    const data = await req.json();
    const { name, categoryId, description, image, imageUrl, isActive, status, seoTitle, seoDescription, sortOrder } = data;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Subcategory name is required' }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ success: false, message: 'Parent Category is required' }, { status: 400 });
    }

    // Verify parent category exists
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return NextResponse.json({ success: false, message: 'Selected parent category not found' }, { status: 404 });
    }

    let slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });

    // Check duplicate within same parent category
    const existing = await Subcategory.findOne({ categoryId, slug });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const subcategory = await Subcategory.create({
      name: name.trim(),
      slug,
      categoryId,
      description: description || '',
      imageUrl: imageUrl || image || parentCategory.imageUrl || '',
      isActive: isActive !== undefined ? isActive : (status !== 'draft' && status !== 'archived'),
      status: status || 'published',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      sortOrder: sortOrder || 0
    });

    const populated = await Subcategory.findById(subcategory._id).populate('categoryId', 'name slug imageUrl');

    return NextResponse.json({
      success: true,
      message: 'Subcategory created successfully',
      subcategory: populated
    });
  } catch (error) {
    console.error('Admin subcategory POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    const { _id, name, slug, categoryId, description, image, imageUrl, isActive, status, seoTitle, seoDescription, sortOrder } = data;

    if (!_id) {
      return NextResponse.json({ success: false, message: 'Subcategory ID is required' }, { status: 400 });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (slug) updateData.slug = slugify(slug, { lower: true, strict: true });
    if (categoryId) updateData.categoryId = categoryId;
    if (description !== undefined) updateData.description = description;
    if (imageUrl || image) updateData.imageUrl = imageUrl || image;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status) updateData.status = status;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const subcategory = await Subcategory.findByIdAndUpdate(_id, updateData, { new: true })
      .populate('categoryId', 'name slug imageUrl');

    if (!subcategory) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Subcategory updated successfully',
      subcategory
    });
  } catch (error) {
    console.error('Admin subcategory PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Subcategory ID is required' }, { status: 400 });
    }

    // Safe delete check: check if any products are linked to this subcategory
    const productsCount = await Product.countDocuments({
      $or: [{ subcategoryId: id }, { subcategory: id }]
    });

    if (productsCount > 0) {
      return NextResponse.json({
        success: false,
        message: `This subcategory contains ${productsCount} product(s). Please reassign these products before deleting the subcategory.`
      }, { status: 400 });
    }

    await Subcategory.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Admin subcategory DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
