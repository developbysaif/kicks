import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrder: {
    type: Number,
    default: 0,
    min: 0
  },
  maxUses: {
    type: Number,
    default: 100,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'coupons',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dual compatibility aliases
couponSchema.virtual('discountType')
  .get(function () {
    return this.type === 'percent' ? 'percentage' : 'fixed';
  })
  .set(function (v) {
    this.type = v === 'percentage' ? 'percent' : v;
  });

couponSchema.virtual('discountValue')
  .get(function () {
    return this.value;
  })
  .set(function (v) {
    this.value = v;
  });

couponSchema.virtual('minOrderAmount')
  .get(function () {
    return this.minOrder;
  })
  .set(function (v) {
    this.minOrder = v;
  });

couponSchema.virtual('usageLimit')
  .get(function () {
    return this.maxUses;
  })
  .set(function (v) {
    this.maxUses = v;
  });

couponSchema.virtual('expiryDate')
  .get(function () {
    return this.expiresAt;
  })
  .set(function (v) {
    this.expiresAt = v;
  });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export default Coupon;
