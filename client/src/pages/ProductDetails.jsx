import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Scale, ShieldCheck, Truck, RefreshCw, CheckCircle, MessageSquare, Send } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariation, setSelectedVariation] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${slug}`);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
      if (data.hasVariations && data.variations && data.variations.length > 0) {
        setSelectedVariation(data.variations[0].options[0].name);
      }

      // Fetch reviews
      const reviewRes = await API.get(`/reviews/product/${data._id}`);
      setReviews(reviewRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen message="Loading Product Details..." />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // Compute price based on variation selection
  let currentPrice = product.salePrice > 0 ? product.salePrice : product.price;
  let originalPrice = product.salePrice > 0 ? product.price : null;

  if (product.hasVariations && selectedVariation) {
    product.variations.forEach(g => {
      const match = g.options.find(o => o.name === selectedVariation);
      if (match) {
        currentPrice = match.salePrice > 0 ? match.salePrice : match.price;
        originalPrice = match.salePrice > 0 ? match.price : null;
      }
    });
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariation, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariation, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    setReviewMsg('');
    try {
      await API.post('/reviews', {
        productId: product._id,
        rating: newRating,
        comment: newComment
      });
      setReviewMsg('Thank you! Your review has been published.');
      setNewComment('');
      // Refresh reviews
      const reviewRes = await API.get(`/reviews/product/${product._id}`);
      setReviews(reviewRes.data || []);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center space-x-2">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-slate-600">Shop</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-50 border border-slate-100 p-6 flex items-center justify-center overflow-hidden shadow-card">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl bg-slate-50 p-1 border-2 overflow-hidden shrink-0 transition-all ${selectedImage === img ? 'border-emerald-600 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {product.category?.name || 'Home Care'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200'}`} />
                ))}
                <span className="text-slate-700 ml-1">{product.rating || 5.0}</span>
              </div>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{reviews.length} Customer Reviews</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-emerald-600 font-bold">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-3xl font-black text-slate-900">Rs. {currentPrice}</span>
            {originalPrice && (
              <span className="text-base text-slate-400 line-through font-semibold">Rs. {originalPrice}</span>
            )}
            {originalPrice && (
              <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-extrabold uppercase rounded-full">
                Save Rs. {originalPrice - currentPrice}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variations Selector */}
          {product.hasVariations && product.variations && product.variations.length > 0 && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select {product.variations[0].title}:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variations[0].options.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => setSelectedVariation(opt.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedVariation === opt.name ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    {opt.name} — Rs. {opt.salePrice > 0 ? opt.salePrice : opt.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden text-xs">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-all"
              >
                Buy Now (Instant Checkout)
              </button>
            </div>

            {/* Extra Wishlist / Compare Row */}
            <div className="flex space-x-4 pt-2">
              <button
                onClick={() => toggleWishlist(product)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isInWishlist(product._id) ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
              <button
                onClick={() => addToCompare(product)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>Add to Compare</span>
              </button>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center text-[11px] text-slate-500">
            <div className="p-2 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <span>100% Authentic</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <Truck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <span>COD Nationwide</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <RefreshCw className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <span>Easy Returns</span>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications & Product Reviews */}
      <div className="pt-12 border-t border-slate-100 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Reviews ({reviews.length})</h3>
          
          {/* Write review form if logged in */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 space-y-4 max-w-2xl">
              <h4 className="text-sm font-bold text-slate-900">Write a Product Review</h4>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700">Rating:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewRating(s)}
                    className="text-amber-400 p-1"
                  >
                    <Star className={`w-5 h-5 ${s <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Write your honest review experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Submit Review
              </button>

              {reviewMsg && <p className="text-xs font-semibold text-emerald-700">{reviewMsg}</p>}
            </form>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl text-xs font-medium mb-8">
              Please <Link to="/login" className="underline font-bold">Login</Link> to write a customer review.
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4 max-w-3xl">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">{r.userName}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                <span className="text-[10px] text-slate-400 block">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
