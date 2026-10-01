import mongoose from 'mongoose';

const variationOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: 0 },
  sku: { type: String, default: '' },
  stock: { type: Number, default: 50 },
  image: { type: String, default: '' }
});

const variationGroupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [variationOptionSchema]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  salePrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 100 },
  sku: { type: String, required: true, unique: true },
  variations: [variationGroupSchema],
  hasVariations: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0 },
  numReviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  specifications: [{ key: String, value: String }]
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', sku: 'text', tags: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
