import mongoose from 'mongoose';

const embeddedOrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  variation: { type: String, default: '' },
  variant: { type: String, default: '' },
  sku: { type: String, default: '' }
}, { _id: true });

const trackingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  comment: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  addressLine: { type: String, default: '', trim: true },
  city: { type: String, default: '', trim: true },
  province: { type: String, default: 'Punjab', trim: true },
  postalCode: { type: String, default: '54000', trim: true },
  country: { type: String, default: 'Pakistan', trim: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  orderNumber: {
    type: String,
    uppercase: true,
    trim: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  customerName: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  email: { type: String, default: '', lowercase: true, trim: true, index: true },
  city: { type: String, default: '', trim: true },
  address: { type: String, default: '', trim: true },
  shippingAddress: {
    type: shippingAddressSchema,
    default: () => ({})
  },
  notes: { type: String, default: '', trim: true },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  shippingFee: { type: Number, default: 150, min: 0 },
  grandTotal: { type: Number, required: true, min: 0 },
  total: { type: Number, default: 0, min: 0 },
  couponCode: { type: String, default: '', uppercase: true, trim: true },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery',
    trim: true
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
    trim: true,
    index: true
  },
  orderStatus: {
    type: String,
    default: 'Pending',
    trim: true,
    index: true
  },
  status: {
    type: String,
    default: 'Pending',
    trim: true,
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

// Pre-validate synchronization hook
orderSchema.pre('validate', function (next) {
  if (this.orderId && !this.orderNumber) {
    this.orderNumber = this.orderId;
  } else if (this.orderNumber && !this.orderId) {
    this.orderId = this.orderNumber;
  }

  if (this.user && !this.userId) {
    this.userId = this.user;
  } else if (this.userId && !this.user) {
    this.user = this.userId;
  }

  if (this.shippingAddress) {
    if (!this.customerName && this.shippingAddress.fullName) {
      this.customerName = this.shippingAddress.fullName;
    }
    if (!this.phone && this.shippingAddress.phone) {
      this.phone = this.shippingAddress.phone;
    }
    if (!this.city && this.shippingAddress.city) {
      this.city = this.shippingAddress.city;
    }
    if (!this.address && this.shippingAddress.addressLine) {
      this.address = this.shippingAddress.addressLine;
    }
  }

  if (!this.shippingAddress || !this.shippingAddress.fullName) {
    this.shippingAddress = {
      fullName: this.customerName || '',
      phone: this.phone || '',
      addressLine: this.address || '',
      city: this.city || '',
      province: 'Punjab',
      postalCode: '54000',
      country: 'Pakistan'
    };
  }

  if (this.grandTotal !== undefined && (this.total === undefined || this.total === 0)) {
    this.total = this.grandTotal;
  } else if (this.total !== undefined && (this.grandTotal === undefined || this.grandTotal === 0)) {
    this.grandTotal = this.total;
  }

  if (this.orderStatus && !this.status) {
    this.status = this.orderStatus;
  } else if (this.status && !this.orderStatus) {
    this.orderStatus = this.status;
  }

  if (Array.isArray(this.orderItems)) {
    this.orderItems.forEach((item) => {
      if (item.product && !item.productId) item.productId = item.product;
      if (item.productId && !item.product) item.product = item.productId;
      if (item.variation && !item.variant) item.variant = item.variation;
      if (item.variant && !item.variation) item.variation = item.variant;
    });
  }

  if (next) next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
