'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, ShoppingBag, Heart, Scale, ShieldCheck, Truck, RefreshCw, Send, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailsPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariation, setSelectedVariation] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
      const { data } = await axios.get(`/api/products/${slug}`);
      if (data.success) {
        setProduct(data.product);
        setReviews(data.reviews || []);
        setRelatedProducts(data.relatedProducts || []);
        if (data.product.images && data.product.images.length > 0) {
          setSelectedImage(data.product.images[0]);
        }
        if (data.product.hasVariations && data.product.variations && data.product.variations.length > 0) {
          setSelectedVariation(data.product.variations[0].options[0].name);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 text-slate-400 font-bold">
          Loading Product Details...
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 text-slate-700 font-bold">
          Product not found
        </main>
        <Footer />
      </div>
    );
  }

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
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 flex items-center space-x-2">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-600">Shop</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-white border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden shadow-card">
              <img
                src={selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl bg-white p-1 border-2 overflow-hidden shrink-0 transition-all ${selectedImage === img ? 'border-emerald-600 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                {product.category?.name || 'Home Care'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{product.name}</h1>
              
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-800">{product.rating || 5.0}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{reviews.length} Customer Reviews</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">Rs. {currentPrice}</span>
              {originalPrice && (
                <span className="text-sm text-slate-400 line-through">Rs. {originalPrice}</span>
              )}
              {originalPrice && (
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-black uppercase rounded-full">
                  Save Rs. {originalPrice - currentPrice}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variations selector */}
            {product.hasVariations && product.variations && product.variations.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Select Option ({product.variations[0].title}):
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations[0].options.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setSelectedVariation(opt.name)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${selectedVariation === opt.name ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-xs font-bold text-slate-800">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all text-center"
              >
                Buy Now (Cash on Delivery)
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3.5 border border-slate-200 rounded-2xl bg-white hover:border-rose-300 text-slate-600 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Nationwide Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>7 Days Return</span>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900">Verified Customer Reviews ({reviews.length})</h3>

          <div className="space-y-4 divide-y divide-slate-100">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews yet for this product. Be the first to share your feedback!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="pt-4 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">You May Also Need</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
