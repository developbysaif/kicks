import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/jwt';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

async function resolveCategoryId(categoryIdOrValue) {
  if (!categoryIdOrValue) return null;

  if (mongoose.Types.ObjectId.isValid(categoryIdOrValue)) {
    return categoryIdOrValue;
  }

  if (typeof categoryIdOrValue === 'object' && categoryIdOrValue._id) {
    if (mongoose.Types.ObjectId.isValid(categoryIdOrValue._id)) {
      return categoryIdOrValue._id;
    }
  }

  const found = await Category.findOne({
    $or: [
      { slug: categoryIdOrValue },
      { name: categoryIdOrValue },
      { slug: slugify(String(categoryIdOrValue), { lower: true }) }
    ]
  });

  return found?._id || null;
}

async function resolveSubcategoryId(subcategoryIdOrValue, parentCategoryId) {
  if (!subcategoryIdOrValue) return null;

  if (mongoose.Types.ObjectId.isValid(subcategoryIdOrValue)) {
    return subcategoryIdOrValue;
  }

  if (typeof subcategoryIdOrValue === 'object' && subcategoryIdOrValue._id) {
    if (mongoose.Types.ObjectId.isValid(subcategoryIdOrValue._id)) {
      return subcategoryIdOrValue._id;
    }
  }

  const query = {
    $or: [
      { slug: subcategoryIdOrValue },
      { name: subcategoryIdOrValue },
      { slug: slugify(String(subcategoryIdOrValue), { lower: true }) }
    ]
  };
  if (parentCategoryId) query.categoryId = parentCategoryId;

  const found = await Subcategory.findOne(query);
  return found?._id || null;
}

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search');
    const categoryFilter = searchParams.get('category');
    const subcategoryFilter = searchParams.get('subcategory');
    const statusFilter = searchParams.get('status');
    const stockFilter = searchParams.get('stock');
    const sort = searchParams.get('sort') || 'newest';

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    let query = {};

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { sku: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } }
      ];
    }

    if (categoryFilter && categoryFilter !== 'all') {
      if (mongoose.Types.ObjectId.isValid(categoryFilter)) {
        query.categoryId = categoryFilter;
      } else {
        const cat = await Category.findOne({ slug: categoryFilter });
        if (cat) query.categoryId = cat._id;
      }
    }

    if (subcategoryFilter && subcategoryFilter !== 'all') {
      if (mongoose.Types.ObjectId.isValid(subcategoryFilter)) {
        query.subcategoryId = subcategoryFilter;
      } else {
        const sub = await Subcategory.findOne({ slug: subcategoryFilter });
        if (sub) query.subcategoryId = sub._id;
      }
    }

    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    if (stockFilter && stockFilter !== 'all') {
      if (stockFilter === 'in_stock') query.stock = { $gt: 10 };
      else if (stockFilter === 'low_stock') query.stock = { $gt: 0, $lte: 10 };
      else if (stockFilter === 'out_of_stock') query.stock = { $lte: 0 };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'name-asc') sortOptions = { name: 1 };
    if (sort === 'name-desc') sortOptions = { name: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };
    if (sort === 'stock-low') sortOptions = { stock: 1 };
    if (sort === 'stock-high') sortOptions = { stock: -1 };

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('categoryId', 'name slug imageUrl')
      .populate('subcategoryId', 'name slug imageUrl')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      products
    });
  } catch (error) {
    console.error('Admin products GET error:', error);
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

    const {
      name,
      description,
      shortDescription,
      brand,
      price,
      compareAtPrice,
      costPrice,
      stock,
      trackInventory,
      allowBackorders,
      status,
      tags,
      collections,
      seoTitle,
      seoDescription,
      isFeatured
    } = data;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    }

    if (price === undefined || price === null || price === '') {
      return NextResponse.json({ success: false, message: 'Product price is required' }, { status: 400 });
    }

    const rawCategoryId = data.categoryId || data.category;
    const resolvedCatId = await resolveCategoryId(rawCategoryId);

    if (!resolvedCatId) {
      return NextResponse.json({ success: false, message: 'Valid parent category is required' }, { status: 400 });
    }

    const rawSubcategoryId = data.subcategoryId || data.subcategory;
    const resolvedSubcatId = await resolveSubcategoryId(rawSubcategoryId, resolvedCatId);

    let slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const sku = data.sku && data.sku.trim()
      ? data.sku.trim().toUpperCase()
      : 'KICK-' + Math.floor(1000 + Math.random() * 9000);

    // Format images array
    let images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    if (images.length === 0 && data.image) {
      images = [data.image];
    }
    if (images.length === 0) {
      images = ['/Shoe Care.png'];
    }

    const parsedPrice = parseFloat(price);
    const parsedCompare = compareAtPrice ? parseFloat(compareAtPrice) : null;
    const parsedCost = costPrice ? parseFloat(costPrice) : null;
    const parsedStock = stock !== undefined && stock !== '' ? parseInt(stock, 10) : 100;
    const productStatus = status || 'published';

    const productPayload = {
      name: name.trim(),
      slug,
      sku,
      brand: brand ? brand.trim() : 'Kick Home Care',
      categoryId: resolvedCatId,
      subcategoryId: resolvedSubcatId,
      category: resolvedCatId,
      subcategory: resolvedSubcatId,
      description: description || '',
      shortDescription: shortDescription || '',
      price: parsedPrice,
      compareAtPrice: parsedCompare,
      costPrice: parsedCost,
      stock: parsedStock,
      trackInventory: trackInventory !== undefined ? trackInventory : true,
      allowBackorders: allowBackorders !== undefined ? allowBackorders : false,
      status: productStatus,
      isActive: productStatus === 'published',
      isFeatured: Boolean(isFeatured),
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
      collections: Array.isArray(collections) ? collections : [],
      images,
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || ''
    };

    const product = await Product.create(productPayload);
    const populated = await Product.findById(product._id)
      .populate('categoryId', 'name slug imageUrl')
      .populate('subcategoryId', 'name slug imageUrl');

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: populated
    });
  } catch (error) {
    console.error('Error creating product:', error);
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
    const { _id, ...fields } = data;

    if (!_id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const updatePayload = {};

    if (fields.name) updatePayload.name = fields.name.trim();
    if (fields.slug) updatePayload.slug = slugify(fields.slug, { lower: true, strict: true });
    if (fields.sku) updatePayload.sku = fields.sku.trim().toUpperCase();
    if (fields.brand !== undefined) updatePayload.brand = fields.brand.trim();
    if (fields.description !== undefined) updatePayload.description = fields.description;
    if (fields.shortDescription !== undefined) updatePayload.shortDescription = fields.shortDescription;

    if (fields.price !== undefined && fields.price !== '') {
      updatePayload.price = parseFloat(fields.price);
    }
    if (fields.compareAtPrice !== undefined) {
      updatePayload.compareAtPrice = fields.compareAtPrice ? parseFloat(fields.compareAtPrice) : null;
    }
    if (fields.costPrice !== undefined) {
      updatePayload.costPrice = fields.costPrice ? parseFloat(fields.costPrice) : null;
    }
    if (fields.stock !== undefined && fields.stock !== '') {
      updatePayload.stock = parseInt(fields.stock, 10);
    }

    if (fields.trackInventory !== undefined) updatePayload.trackInventory = fields.trackInventory;
    if (fields.allowBackorders !== undefined) updatePayload.allowBackorders = fields.allowBackorders;
    if (fields.isFeatured !== undefined) updatePayload.isFeatured = fields.isFeatured;

    if (fields.status) {
      updatePayload.status = fields.status;
      updatePayload.isActive = fields.status === 'published';
    } else if (fields.isActive !== undefined) {
      updatePayload.isActive = fields.isActive;
      updatePayload.status = fields.isActive ? 'published' : 'draft';
    }

    if (fields.categoryId || fields.category) {
      const resolvedCatId = await resolveCategoryId(fields.categoryId || fields.category);
      if (resolvedCatId) {
        updatePayload.categoryId = resolvedCatId;
        updatePayload.category = resolvedCatId;
      }
    }

    if (fields.subcategoryId !== undefined || fields.subcategory !== undefined) {
      const parentCat = updatePayload.categoryId || fields.categoryId || fields.category;
      const resolvedSubcatId = await resolveSubcategoryId(fields.subcategoryId || fields.subcategory, parentCat);
      updatePayload.subcategoryId = resolvedSubcatId;
      updatePayload.subcategory = resolvedSubcatId;
    }

    if (Array.isArray(fields.images)) {
      updatePayload.images = fields.images.filter(Boolean);
    } else if (fields.image) {
      updatePayload.images = [fields.image];
    }

    if (fields.tags !== undefined) {
      updatePayload.tags = Array.isArray(fields.tags) ? fields.tags : (typeof fields.tags === 'string' ? fields.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);
    }

    if (fields.seoTitle !== undefined) updatePayload.seoTitle = fields.seoTitle;
    if (fields.seoDescription !== undefined) updatePayload.seoDescription = fields.seoDescription;

    const product = await Product.findByIdAndUpdate(_id, updatePayload, { new: true })
      .populate('categoryId', 'name slug imageUrl')
      .populate('subcategoryId', 'name slug imageUrl');

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
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
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    // Safe deletion strategy: Check if product is referenced in existing orders
    const orderCount = await Order.countDocuments({
      'orderItems.product': id
    });

    if (orderCount > 0) {
      // Soft-delete / Archive product instead of breaking historical customer order data
      await Product.findByIdAndUpdate(id, {
        status: 'archived',
        isActive: false
      });

      return NextResponse.json({
        success: true,
        message: 'Product is linked to customer orders. It has been safely archived and removed from the storefront.'
      });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted permanently'
    });
  } catch (error) {
    console.error('Admin product DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
