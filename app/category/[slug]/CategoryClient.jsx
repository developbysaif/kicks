'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, CheckCircle2, Truck, ShieldCheck, RefreshCw, Headphones, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import PageSection from '@/components/PageSection';

export default function CategoryClient({
  slug,
  currentMeta,
  initialProducts = [],
  initialSubcategories = []
}) {
  const [products] = useState(initialProducts);
  const [subcategories] = useState(initialSubcategories);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  // Filter by Subcategory
  const filteredProducts = useMemo(() => {
    if (selectedSubcategory === 'all') return products;
    return products.filter((p) => {
      const subSlug = p.subcategoryId?.slug || p.subcategory?.slug || p.subcategoryId;
      return subSlug === selectedSubcategory;
    });
  }, [products, selectedSubcategory]);

  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    return result;
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] font-sans">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/shop" className="hover:text-red-600 transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-red-600 font-bold capitalize">{currentMeta.name}</span>
          </nav>
        </div>
      </div>

      <main className="w-full flex-1">
        {/* 1. CATEGORY HERO BANNER — WHITE */}
        <PageSection variant="white" className="pt-6 pb-8">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[280px] sm:min-h-[340px] flex items-end"
            style={{
              backgroundImage: `url(${currentMeta.bannerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

            {/* Text content pinned to bottom */}
            <div className="relative z-10 p-8 sm:p-12 space-y-3 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D0161D] text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kick® Official Category</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {currentMeta.name}
              </h1>
              <p className="text-sm font-semibold text-red-400">
                {currentMeta.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                {currentMeta.description}
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="flex items-center space-x-1.5 text-white/80 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Kick Certified</span>
                </div>
                <div className="flex items-center space-x-1.5 text-white/80 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Home-Safe Formula</span>
                </div>
                <div className="flex items-center space-x-1.5 text-white/80 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Pakistan-Made</span>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 2. CATEGORY PRODUCTS GRID & CONTROLS — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="space-y-6">
            {/* Subcategory Filter Tabs if subcategories exist */}
            {subcategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedSubcategory === 'all'
                      ? 'bg-white text-black font-black shadow-md'
                      : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
                  }`}
                >
                  All {currentMeta.name} ({products.length})
                </button>
                {subcategories.map((sub) => {
                  const isActive = selectedSubcategory === sub.slug;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => setSelectedSubcategory(sub.slug)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-white text-black font-black shadow-md'
                          : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Controls Bar — White Card on Red */}
            <div className="bg-white rounded-2xl p-4 border border-white/30 shadow-lg flex items-center justify-between gap-4 text-slate-900">
              <span className="text-xs font-bold text-[#1A1A1A]">
                Showing <span className="text-[#D0161D] font-black">{sortedProducts.length}</span> Products
              </span>

              <div className="flex items-center space-x-2">
                <label htmlFor="cat-sort-select" className="text-xs text-slate-400 hidden sm:inline">Sort:</label>
                <select
                  id="cat-sort-select"
                  aria-label="Sort products by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1A1A1A] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid — White Cards on Red */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-white/20 shadow-xl max-w-lg mx-auto">
                <p className="text-base font-bold text-slate-800">No products found in this category.</p>
                <p className="text-xs text-slate-500 mt-1">Please check back soon or browse our other categories.</p>
                <div className="mt-4 flex justify-center gap-3">
                  {selectedSubcategory !== 'all' && (
                    <button
                      onClick={() => setSelectedSubcategory('all')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      View All {currentMeta.name}
                    </button>
                  )}
                  <Link
                    href="/shop"
                    className="px-5 py-2.5 bg-[#D0161D] text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Explore All Categories
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        </PageSection>

        {/* 3. VALUE GUARANTEES — WHITE */}
        <PageSection variant="white" className="border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Fast Nationwide Shipping</h4>
                <p className="text-xs text-slate-500 mt-0.5">Reliable delivery across Pakistan</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Lab-Certified Purity</h4>
                <p className="text-xs text-slate-500 mt-0.5">100% genuine formulation</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Cash on Delivery</h4>
                <p className="text-xs text-slate-500 mt-0.5">Pay safely at doorstep</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Expert Assistance</h4>
                <p className="text-xs text-slate-500 mt-0.5">Customer service ready to help</p>
              </div>
            </div>
          </div>
        </PageSection>
      </main>

      <Footer />
    </div>
  );
}
