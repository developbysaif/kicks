'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <span>My Saved Wishlist ({wishlist.length})</span>
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
            <Heart className="w-16 h-16 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Your Wishlist is Empty</p>
            <p className="text-xs text-slate-400 mt-1">Click the heart icon on any product to save it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
