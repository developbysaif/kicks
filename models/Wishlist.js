import mongoose from 'mongoose';
import Favorite from './Favorite';

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true
});

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
export { Favorite };
export default Wishlist;
