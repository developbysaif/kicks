import mongoose from 'mongoose';

const variantOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  compareAtPrice: { type: Number, default: null },
  sku: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  image: { type: String, default: '' }
}, { _id: true });

const variantGroupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [variantOptionSchema]
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  shortDescription: { type: String, default: '' },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0, index: true },
  compareAtPrice: { type: Number, default: null },
  sizeLabel: { type: String, default: '' },
  variants: [variantGroupSchema],
  stock: { type: Number, required: true, default: 0, min: 0 },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
  ratingAvg: { type: Number, default: 5.0, min: 0, max: 5, index: true },
  ratingCount: { type: Number, default: 0, min: 0 },
  images: {
    type: [{ type: String }],
    validate: [
      (val) => Array.isArray(val) && val.length >= 1 && val.length <= 6,
      'Products must have between 1 and 6 images.'
    ]
  },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dual compatibility aliases
productSchema.virtual('category')
  .get(function () {
    return this.categoryId;
  })
  .set(function (v) {
    this.categoryId = v;
  });

productSchema.virtual('rating')
  .get(function () {
    return this.ratingAvg;
  })
  .set(function (v) {
    this.ratingAvg = v;
  });

productSchema.virtual('numReviews')
  .get(function () {
    return this.ratingCount;
  })
  .set(function (v) {
    this.ratingCount = v;
  });

productSchema.virtual('salePrice')
  .get(function () {
    // If compareAtPrice exists and is higher than price, price is the discounted price
    return this.compareAtPrice ? this.price : 0;
  })
  .set(function (v) {
    if (v && v < this.price) {
      this.compareAtPrice = this.price;
      this.price = v;
    }
  });

productSchema.virtual('hasVariations')
  .get(function () {
    return Array.isArray(this.variants) && this.variants.length > 0;
  });

productSchema.virtual('variations')
  .get(function () {
    return this.variants;
  })
  .set(function (v) {
    this.variants = v;
  });

productSchema.index({ name: 'text', description: 'text', sku: 'text', shortDescription: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
