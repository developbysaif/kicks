import Category from '../models/Category.js';
import Product from '../models/Product.js';
import slugify from 'slugify';

// @desc Get all categories with dynamic productCount
// @route GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // Attach product count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get category by slug or id
// @route GET /api/categories/:identifier
export const getCategoryByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(identifier);
    }
    if (!category) {
      category = await Category.findOne({ slug: identifier });
    }

    if (category) {
      const count = await Product.countDocuments({ category: category._id, isActive: true });
      res.json({
        ...category.toObject(),
        productCount: count
      });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create category (Admin)
// @route POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update category (Admin)
// @route PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      if (req.body.name && req.body.name !== category.name) {
        category.slug = slugify(req.body.name, { lower: true, strict: true });
      }
      category.description = req.body.description !== undefined ? req.body.description : category.description;
      category.image = req.body.image || category.image;
      category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete category (Admin)
// @route DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
