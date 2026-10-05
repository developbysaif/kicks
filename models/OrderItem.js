import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  variant: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'orderItems'
});

const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;
