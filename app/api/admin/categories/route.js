import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/jwt';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { _id: 'cat-1', name: 'Shoe Care', slug: 'shoe-care', description: 'Shoe cleaning, shine & protection', imageUrl: '/Shoe Care.png', isActive: true, status: 'published', sortOrder: 1, subcategoryCount: 0, productCount: 12 },
  { _id: 'cat-2', name: 'Laundry Care', slug: 'laundry-care', description: 'Bleach, whitening & fabric care', imageUrl: '/laundry Care.png', isActive: true, status: 'published', sortOrder: 2, subcategoryCount: 0, productCount: 10 },
  { _id: 'cat-3', name: 'Home Cleaning', slug: 'home-cleaning', description: 'Floor cleaner, phenyle & surface wash', imageUrl: '/Home Cleaning.png', isActive: true, status: 'published', sortOrder: 3, subcategoryCount: 0, productCount: 15 },
  { _id: 'cat-4', name: 'Dish Care', slug: 'dish-care', description: 'Dishwashing liquids & gels', imageUrl: '/dish care.png', isActive: true, status: 'published', sortOrder: 4, subcategoryCount: 0, productCount: 8 },
  { _id: 'cat-5', name: 'Washroom Cleaning', slug: 'washroom-cleaning', description: 'Drain openers & bathroom cleaning', imageUrl: '/washroom cleaning.png', isActive: true, status: 'published', sortOrder: 5, subcategoryCount: 0, productCount: 6 },
  { _id: 'cat-6', name: 'Mosquito Protection', slug: 'mosquito-protection', description: 'Coils, sprays & insect protection', imageUrl: '/mosquito protection.png', isActive: true, status: 'published', sortOrder: 6, subcategoryCount: 0, productCount: 5 }
];

function getMemoryCategories() {
  if (!global.memoryCategories || !Array.isArray(global.memoryCategories) || global.memoryCategories.length === 0) {
    global.memoryCategories = [...DEFAULT_CATEGORIES];
  }
  return global.memoryCategories;
}

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    if (db && mongoose.connection.readyState === 1) {
      const categories = await Category.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();

      // Attach counts for products and subcategories
      const categoryIds = categories.map((c) => c._id);
      const [subCounts, prodCounts] = await Promise.all([
        Subcategory.aggregate([
          { $match: { categoryId: { $in: categoryIds } } },
          { $group: { _id: '$categoryId', count: { $sum: 1 } } }
        ]).catch(() => []),
        Product.aggregate([
          { $match: { categoryId: { $in: categoryIds } } },
          { $group: { _id: '$categoryId', count: { $sum: 1 } } }
        ]).catch(() => [])
      ]);

      const subMap = {};
      subCounts.forEach((s) => {
        subMap[s._id.toString()] = s.count;
      });

      const prodMap = {};
      prodCounts.forEach((p) => {
        prodMap[p._id.toString()] = p.count;
      });

      const enriched = categories.map((c) => ({
        ...c,
        subcategoryCount: subMap[c._id.toString()] || 0,
        productCount: prodMap[c._id.toString()] || 0
      }));

      return NextResponse.json({
        success: true,
        categories: enriched
      });
    }

    // Memory fallback when DB is not connected
    const memCats = getMemoryCategories();
    return NextResponse.json({
      success: true,
      categories: memCats
    });
  } catch (error) {
    console.error('Admin categories GET error:', error);
    const memCats = getMemoryCategories();
    return NextResponse.json({ success: true, categories: memCats });
  }
}

export async function POST(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const data = await req.json();
    const { name, description, image, imageUrl, bannerUrl, isActive, status, seoTitle, seoDescription, sortOrder } = data;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    let slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });

    if (db && mongoose.connection.readyState === 1) {
      // Check if slug exists
      const existing = await Category.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }

      const category = await Category.create({
        name: name.trim(),
        slug,
        description: description || '',
        imageUrl: imageUrl || image || '/Shoe Care.png',
        bannerUrl: bannerUrl || '',
        isActive: isActive !== undefined ? isActive : (status !== 'draft' && status !== 'archived'),
        status: status || 'published',
        seoTitle: seoTitle || '',
        seoDescription: seoDescription || '',
        sortOrder: sortOrder || 0
      });

      return NextResponse.json({ success: true, message: 'Category created successfully', category });
    }

    // Fallback in-memory category creation (when MongoDB is not connected)
    const memCats = getMemoryCategories();
    const existingMem = memCats.find((c) => c.slug === slug);
    if (existingMem) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newCategory = {
      _id: 'cat-' + Date.now(),
      name: name.trim(),
      slug,
      description: description || '',
      imageUrl: imageUrl || image || '/Shoe Care.png',
      bannerUrl: bannerUrl || '',
      isActive: isActive !== undefined ? isActive : (status !== 'draft' && status !== 'archived'),
      status: status || 'published',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      sortOrder: sortOrder || 0,
      subcategoryCount: 0,
      productCount: 0,
      createdAt: new Date().toISOString()
    };

    memCats.push(newCategory);
    return NextResponse.json({ success: true, message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Admin category POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const data = await req.json();
    const { _id, name, slug, description, image, imageUrl, bannerUrl, isActive, status, seoTitle, seoDescription, sortOrder } = data;

    if (!_id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (slug) updateData.slug = slugify(slug, { lower: true, strict: true });
    if (description !== undefined) updateData.description = description;
    if (imageUrl || image) updateData.imageUrl = imageUrl || image;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status) updateData.status = status;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    if (db && mongoose.connection.readyState === 1) {
      const category = await Category.findByIdAndUpdate(_id, updateData, { new: true });
      if (!category) {
        return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Category updated successfully', category });
    }

    // Memory fallback update
    const memCats = getMemoryCategories();
    const idx = memCats.findIndex((c) => String(c._id) === String(_id));
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    memCats[idx] = { ...memCats[idx], ...updateData };
    return NextResponse.json({ success: true, message: 'Category updated successfully', category: memCats[idx] });
  } catch (error) {
    console.error('Admin category PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }

    if (db && mongoose.connection.readyState === 1) {
      // 1. Check if subcategories exist under this category
      const subCount = await Subcategory.countDocuments({ categoryId: id }).catch(() => 0);
      if (subCount > 0) {
        return NextResponse.json({
          success: false,
          message: `This category contains ${subCount} subcategory(ies). Please move or remove them before deleting the category.`
        }, { status: 400 });
      }

      // 2. Check if products are linked to this category
      const productsCount = await Product.countDocuments({
        $or: [{ categoryId: id }, { category: id }]
      }).catch(() => 0);
      if (productsCount > 0) {
        return NextResponse.json({
          success: false,
          message: `This category contains ${productsCount} product(s). Please move or remove them before deleting the category.`
        }, { status: 400 });
      }

      await Category.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    }

    // Memory fallback delete
    const memCats = getMemoryCategories();
    const idx = memCats.findIndex((c) => String(c._id) === String(id));
    if (idx !== -1) {
      memCats.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Admin category DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
