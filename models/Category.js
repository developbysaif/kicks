import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  bannerUrl: { type: String, default: '' },
  sortOrder: { type: Number, default: 0, index: true },
  isActive: { type: Boolean, default: true, index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dual compatibility alias: 'image' mirrors 'imageUrl'
categorySchema.virtual('image')
  .get(function () {
    return this.imageUrl;
  })
  .set(function (v) {
    this.imageUrl = v;
  });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
