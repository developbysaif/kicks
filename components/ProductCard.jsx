'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Scale, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  const isWishlisted = isInWishlist(product._id);
  const currentPrice = product.salePrice > 0 ? product.salePrice : product.price;
  const originalPrice = product.salePrice > 0 ? product.price : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : '/kick.jpeg';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
    >
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-xl bg-gray-50 overflow-hidden mb-3 border border-gray-50 flex items-center justify-center">
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Action Buttons Top Right */}
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => toggleWishlist(product)}
            className={`p-1.5 rounded-full shadow-sm transition-colors ${
              isWishlisted ? 'bg-red-600 text-white' : 'bg-white text-gray-400 hover:text-red-600 border border-gray-100'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => addToCompare(product)}
            className="p-1.5 bg-white text-gray-400 hover:text-gray-700 rounded-full shadow-sm border border-gray-100 transition-colors"
            title="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Product Image Link */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full p-2 flex items-center justify-center">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
            src={primaryImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="px-1 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category */}
          <span className="block text-[11px] font-normal text-gray-400 mb-0.5">
            {product.category?.name || 'Home Care'}
          </span>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs font-bold text-gray-900 line-clamp-1 hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-amber-500 font-semibold">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-gray-400 font-normal">({product.numReviews || 150})</span>
          </div>

          {/* Price & Volume */}
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm font-extrabold text-gray-900">
                Rs. {currentPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  Rs. {originalPrice}
                </span>
              )}
            </div>
            {product.volume && (
              <span className="text-[10px] text-gray-400 font-medium">
                {product.volume}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product, 1)}
          className="w-full mt-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center space-x-1 shadow-sm"
        >
          <span>{product.hasVariants ? 'Select Options' : 'Add to Cart'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;

