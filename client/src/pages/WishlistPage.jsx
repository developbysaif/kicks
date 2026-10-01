import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return <EmptyState title="Your Wishlist is Empty" description="Save items you love to view or buy later." actionText="Explore Products" actionLink="/shop" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900">My Wishlist</h1>
        <p className="text-xs text-slate-500 mt-1">{wishlist.length} saved products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((p) => (
          <ProductCard key={p._id || p} product={p} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
