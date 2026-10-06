'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Scale, Star, ShoppingBag, Eye } from 'lucide-react';
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative"
    >

      {/* Top Image Container — full image, no side spaces */}
      <div className="relative aspect-square w-full rounded-2xl bg-gray-50 overflow-hidden mb-4 border border-gray-100 flex items-center justify-center">

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#D0161D] text-white text-[11px] font-black rounded-xl shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Bestseller / Featured badge */}
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-amber-400 text-white text-[11px] font-black rounded-xl shadow-sm">
            ⭐ Best Seller
          </span>
        )}

        {/* Action Buttons Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => toggleWishlist(product)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted ? 'bg-[#D0161D] text-white' : 'bg-white text-gray-400 hover:text-[#D0161D] border border-gray-100'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => addToCompare(product)}
            aria-label={`Compare ${product.name}`}
            className="p-2 bg-white text-gray-400 hover:text-gray-700 rounded-full shadow-md border border-gray-100 transition-colors"
            title="Compare"
          >
            <Scale className="w-4 h-4" />
          </motion.button>

          {onQuickView && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.name}`}
              className="p-2 bg-white text-gray-400 hover:text-[#D0161D] rounded-full shadow-md border border-gray-100 transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Product Image Link */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full" aria-label={`View ${product.name}`}>
          <motion.img
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category */}
          <span className="block text-[11px] font-medium text-gray-400">
            {product.category?.name || 'Home Care'}
          </span>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-[#D0161D] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Volume */}
          {product.volume && (
            <span className="block text-[11px] text-gray-400 font-medium">{product.volume}</span>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-1 text-[12px] text-amber-500 font-semibold">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-gray-400 font-normal text-[11px]">({product.numReviews || 150})</span>
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-extrabold text-gray-900">
              Rs. {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through font-normal">
                Rs. {originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product, '', 1)}
          aria-label={product.hasVariants ? `Select options for ${product.name}` : `Add ${product.name} to cart`}
          className="w-full py-2.5 px-4 bg-[#D0161D] hover:bg-red-800 text-white rounded-xl font-bold text-xs tracking-wide transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{product.hasVariants ? 'Select Options' : 'Add to Cart'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
