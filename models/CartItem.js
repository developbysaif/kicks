import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  variant: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, {
  timestamps: true,
  collection: 'cartItems'
});

// Unique compound index: same user + product + variant cannot have duplicate rows
cartItemSchema.index({ userId: 1, productId: 1, variant: 1 }, { unique: true });

const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
export default CartItem;
