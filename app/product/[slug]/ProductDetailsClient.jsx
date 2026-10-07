'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, ShoppingBag, Heart, Scale, ShieldCheck, Truck, RefreshCw, Send, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import PageSection from '@/components/PageSection';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailsClient({
  slug,
  initialProduct = null,
  initialReviews = [],
  initialRelatedProducts = []
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  const [product, setProduct] = useState(initialProduct);
  const [reviews, setReviews] = useState(initialReviews);
  const [relatedProducts, setRelatedProducts] = useState(initialRelatedProducts);
  const [selectedImage, setSelectedImage] = useState(
    initialProduct?.images && initialProduct.images.length > 0 ? initialProduct.images[0] : ''
  );
  const [selectedVariation, setSelectedVariation] = useState(() => {
    if (initialProduct?.hasVariations && initialProduct?.variations && initialProduct?.variations.length > 0) {
      return initialProduct.variations[0].options?.[0]?.name || '';
    }
    return '';
  });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(!initialProduct);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchProductDetails = useCallback(async () => {
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
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!initialProduct || initialProduct.slug !== slug) {
      fetchProductDetails();
    }
  }, [slug, initialProduct, fetchProductDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 text-slate-400 font-bold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#D0161D] mr-2" />
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
        <main className="flex-1 flex flex-col items-center justify-center py-20 text-slate-700 font-bold space-y-4">
          <p className="text-lg">Product not found</p>
          <Link href="/shop" className="px-5 py-2.5 bg-[#D0161D] text-white rounded-xl text-xs font-bold">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  let currentPrice = product.salePrice > 0 ? product.salePrice : product.price;
  let originalPrice = product.salePrice > 0 ? product.price : null;

  if (product.hasVariations && selectedVariation) {
    product.variations.forEach((g) => {
      const match = g.options?.find((o) => o.name === selectedVariation);
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
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <main className="w-full flex-1">
        {/* 1. PRODUCT DETAILS & BUY BOX — WHITE */}
        <PageSection variant="white" className="py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center space-x-2 mb-8">
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
                  src={selectedImage || product.images?.[0] || '/kick.jpeg'}
                  alt={product.name}
                  loading="eager"
                  className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      aria-label={`View image ${idx + 1}`}
                      className={`w-20 h-20 rounded-2xl bg-white p-1 border-2 overflow-hidden shrink-0 transition-all ${
                        selectedImage === img ? 'border-[#D0161D] shadow-md' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-black text-[#D0161D] uppercase tracking-widest">
                  {product.category?.name || product.brand || 'Home Care'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{product.name}</h1>

                <div className="flex items-center space-x-3 mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || product.ratingAvg || 5)
                            ? 'fill-current'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">
                    {product.rating || product.ratingAvg || 5.0}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{reviews.length} Customer Reviews</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-baseline space-x-3 shadow-xs">
                <span className="text-3xl font-black text-slate-900">Rs. {currentPrice}</span>
                {originalPrice && (
                  <span className="text-sm text-slate-400 line-through">Rs. {originalPrice}</span>
                )}
                {originalPrice && (
                  <span className="px-2.5 py-1 bg-rose-100 text-[#D0161D] text-xs font-black uppercase rounded-full">
                    Save Rs. {originalPrice - currentPrice}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {product.shortDescription || product.description}
              </p>

              {/* Variations selector */}
              {product.hasVariations && product.variations && product.variations.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Select Option ({product.variations[0].title}):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variations[0].options?.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => setSelectedVariation(opt.name)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedVariation === opt.name
                            ? 'border-[#D0161D] bg-red-50 text-[#D0161D] shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
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
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
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
                  aria-label={`Add ${product.name} to shopping cart`}
                  className="flex-1 py-3.5 bg-[#D0161D] hover:bg-red-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  aria-label={`Buy ${product.name} now`}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all text-center"
                >
                  Buy Now (Cash on Delivery)
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={`Add ${product.name} to wishlist`}
                  className="p-3.5 border border-slate-200 rounded-2xl bg-white hover:border-rose-300 text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Value Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#D0161D]" />
                  <span>Nationwide Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#D0161D]" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-[#D0161D]" />
                  <span>7 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 2. CUSTOMER REVIEWS — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-white rounded-full"></span>
              <h2 className="text-2xl font-black text-white">Verified Customer Reviews ({reviews.length})</h2>
            </div>
            <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium">
              Real experiences from homeowners across Pakistan.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-white/20 shadow-xl space-y-6 text-slate-900">
            <div className="space-y-4 divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No reviews yet for this product. Be the first to share your feedback!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id || rev.id} className="pt-4 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </PageSection>

        {/* 3. RELATED PRODUCTS — WHITE */}
        {relatedProducts.length > 0 && (
          <PageSection variant="white">
            <div className="mb-8">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-[#D0161D] rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">You May Also Need</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Frequently paired with this product for total household care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </PageSection>
        )}
      </main>

      <Footer />
    </div>
  );
}
