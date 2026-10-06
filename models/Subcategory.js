import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true, index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published', index: true },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  sortOrder: { type: Number, default: 0, index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dual compatibility virtuals
subcategorySchema.virtual('image')
  .get(function () {
    return this.imageUrl;
  })
  .set(function (v) {
    this.imageUrl = v;
  });

subcategorySchema.virtual('category')
  .get(function () {
    return this.categoryId;
  })
  .set(function (v) {
    this.categoryId = v;
  });

// Ensure a slug is unique per parent category
subcategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });

const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema);
export default Subcategory;
