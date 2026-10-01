import Product from '../models/Product.js';
import Category from '../models/Category.js';
import slugify from 'slugify';

// @desc Fetch all products with filters, sorting, search, pagination
// @route GET /api/products
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { sku: { $regex: req.query.keyword, $options: 'i' } },
            { tags: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    const categoryQuery = {};
    if (req.query.category) {
      const categoryDoc = await Category.findOne({ slug: req.query.category });
      if (categoryDoc) {
        categoryQuery.category = categoryDoc._id;
      } else if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryQuery.category = req.query.category;
      }
    }

    const priceQuery = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceQuery.price = {};
      if (req.query.minPrice) priceQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceQuery.price.$lte = Number(req.query.maxPrice);
    }

    const ratingQuery = req.query.minRating ? { rating: { $gte: Number(req.query.minRating) } } : {};
    const featuredQuery = req.query.isFeatured ? { isFeatured: true } : {};
    const bestSellerQuery = req.query.isBestSeller ? { isBestSeller: true } : {};
    const newArrivalQuery = req.query.isNewArrival ? { isNewArrival: true } : {};

    const filterQuery = {
      isActive: true,
      ...keyword,
      ...categoryQuery,
      ...priceQuery,
      ...ratingQuery,
      ...featuredQuery,
      ...bestSellerQuery,
      ...newArrivalQuery
    };

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'price-low') sortOption = { price: 1 };
    else if (req.query.sort === 'price-high') sortOption = { price: -1 };
    else if (req.query.sort === 'popular') sortOption = { numReviews: -1 };
    else if (req.query.sort === 'rating') sortOption = { rating: -1 };
    else if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };

    const count = await Product.countDocuments(filterQuery);
    const products = await Product.find(filterQuery)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Fetch single product by slug or id
// @route GET /api/products/:identifier
export const getProductByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug');
    }
    
    if (!product) {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug');
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get search suggestions (quick search preview)
// @route GET /api/products/search/suggestions
export const getSearchSuggestions = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) return res.json([]);

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name slug price salePrice images category')
      .populate('category', 'name')
      .limit(6);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a product (Admin)
// @route POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, shortDescription, category, images, price, salePrice, stock, sku, variations, isFeatured, isBestSeller, isNewArrival, tags, specifications } = req.body;

    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();

    const product = new Product({
      name,
      slug,
      description,
      shortDescription: shortDescription || '',
      category,
      images: images && images.length ? images : ['/images/products/placeholder.webp'],
      price,
      salePrice: salePrice || 0,
      stock: stock || 50,
      sku: sku || `SKU-${Date.now()}`,
      variations: variations || [],
      hasVariations: variations && variations.length > 0,
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : true,
      tags: tags || [],
      specifications: specifications || []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product (Admin)
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      if (req.body.name && req.body.name !== product.name) {
        product.slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Date.now();
      }
      product.description = req.body.description || product.description;
      product.shortDescription = req.body.shortDescription !== undefined ? req.body.shortDescription : product.shortDescription;
      product.category = req.body.category || product.category;
      product.images = req.body.images || product.images;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.salePrice = req.body.salePrice !== undefined ? req.body.salePrice : product.salePrice;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.sku = req.body.sku || product.sku;
      product.variations = req.body.variations || product.variations;
      product.hasVariations = req.body.variations && req.body.variations.length > 0;
      product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
      product.isBestSeller = req.body.isBestSeller !== undefined ? req.body.isBestSeller : product.isBestSeller;
      product.isNewArrival = req.body.isNewArrival !== undefined ? req.body.isNewArrival : product.isNewArrival;
      product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;
      product.tags = req.body.tags || product.tags;
      product.specifications = req.body.specifications || product.specifications;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
