'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const [selectedVariation, setSelectedVariation] = useState(() => {
    if (product.hasVariations && product.variations && product.variations.length > 0) {
      const group = product.variations[0];
      return group.options && group.options.length > 0 ? group.options[0].name : '';
    }
    return '';
  });

  const [quantity, setQuantity] = useState(1);

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 max-h-[90vh] overflow-y-auto z-50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex items-center justify-center">
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full max-h-80 object-contain rounded-2xl"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              {product.category?.name || 'Home Care'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{product.name}</h2>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">({product.numReviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">Rs. {currentPrice}</span>
              {originalPrice && (
                <span className="text-sm text-slate-400 line-through">Rs. {originalPrice}</span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Variations selector */}
            {product.hasVariations && product.variations && product.variations.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select {product.variations[0].title}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations[0].options.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setSelectedVariation(opt.name)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${selectedVariation === opt.name ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-600 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-slate-500 hover:text-emerald-600 font-medium"
            >
              View Full Product Specifications & Reviews →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default QuickViewModal;
