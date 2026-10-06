'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* SECTION 1 (WHITE) -> Wishlist Items */}
        <section className="bg-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <Heart className="w-7 h-7 text-[#D0161D] fill-[#D0161D]" />
              <span>My Saved Wishlist ({wishlist.length})</span>
            </h1>

            {wishlist.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-800">Your Wishlist is Empty</p>
                <p className="text-xs text-slate-500 mt-1 mb-6">Click the heart icon on any product to save it here!</p>
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[#D0161D] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-sm inline-block"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((p) => (
                  <ProductCard key={p._id || p.slug} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2 (RED) -> Value Guarantees */}
        <section className="bg-[#D0161D] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider">
                Kick Assurance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Why Buy Direct From Kick
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Save your favorites and enjoy 100% genuine guaranteed products delivered straight to your door.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: '100% Genuine Care', desc: 'Direct from the Ibn Khushi factory with premium packaging.', icon: '🛡️' },
                { title: 'Speedy Dispatch', desc: 'Fast delivery across all major cities of Pakistan.', icon: '⚡' },
                { title: 'Dedicated Support', desc: 'Active WhatsApp assistance for advice and questions.', icon: '💬' },
                { title: 'Best Price Guarantee', desc: 'Direct brand rates with exclusive bundle discounts.', icon: '🏷️' }
              ].map((g, idx) => (
                <div
                  key={idx}
                  className="bg-white text-slate-900 rounded-3xl p-6 border border-white/20 shadow-sm space-y-3"
                >
                  <div className="text-3xl">{g.icon}</div>
                  <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
