import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true,
  collection: 'reviews',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dual compatibility aliases
reviewSchema.virtual('product')
  .get(function () {
    return this.productId;
  })
  .set(function (v) {
    this.productId = v;
  });

reviewSchema.virtual('user')
  .get(function () {
    return this.userId;
  })
  .set(function (v) {
    this.userId = v;
  });

reviewSchema.virtual('isApproved')
  .get(function () {
    return this.status === 'approved';
  })
  .set(function (v) {
    this.status = v ? 'approved' : 'pending';
  });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
