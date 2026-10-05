import mongoose from 'mongoose';

const embeddedOrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  variant: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const trackingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  comment: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  notes: { type: String, default: '' },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  shippingFee: { type: Number, default: 200, min: 0 },
  total: { type: Number, required: true, min: 0 },
  couponCode: { type: String, default: '', trim: true },
  paymentMethod: {
    type: String,
    enum: ['cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  orderItems: [embeddedOrderItemSchema],
  trackingHistory: [trackingHistorySchema]
}, {
  timestamps: true,
  collection: 'orders',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compatibility aliases
orderSchema.virtual('orderId')
  .get(function () {
    return this.orderNumber;
  })
  .set(function (v) {
    this.orderNumber = v;
  });

orderSchema.virtual('user')
  .get(function () {
    return this.userId;
  })
  .set(function (v) {
    this.userId = v;
  });

orderSchema.virtual('grandTotal')
  .get(function () {
    return this.total;
  })
  .set(function (v) {
    this.total = v;
  });

orderSchema.virtual('orderStatus')
  .get(function () {
    return this.status;
  })
  .set(function (v) {
    this.status = v ? v.toLowerCase() : 'pending';
  });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
