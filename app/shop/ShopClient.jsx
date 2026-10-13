'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import PageSection from '@/components/PageSection';
import { Filter, Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/products?sort=${sortBy}`;
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const { data } = await axios.get(url);
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* 1. HERO TITLE BANNER — WHITE */}
      <PageSection variant="white" className="pt-6 pb-8">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] flex items-end"
          style={{
            backgroundImage: `url('/shop-all-banner.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark gradient overlay for text readability on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:hidden" />

          {/* Text content pinned to left */}
          <div className="relative z-10 p-8 sm:p-12 space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D0161D] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Kick® Official Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              All Kick Products Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl drop-shadow">
              Browse Pakistan&apos;s premier home care &amp; shoe maintenance formulations with guaranteed quality and nationwide fast delivery.
            </p>
            <div className="pt-2">
              <span className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-wider border border-white/30">
                {products.length} Products Available
              </span>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 2. CATALOG PRODUCTS & FILTER SECTION — RED */}
      <PageSection variant="red" className="border-t border-b border-red-700/20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filter — White Card on Red */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-white/30 shadow-xl text-slate-900">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D0161D]" />
                <span>Categories</span>
              </h3>

              <div className="space-y-2 text-xs font-semibold">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-[#D0161D] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All Products
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${selectedCategory === c.slug ? 'bg-[#D0161D] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Grid — White Card Toolbar & White Product Cards */}
          <div className="flex-1 w-full">
            {/* Top Toolbar — White Card on Red */}
            <div className="bg-white rounded-2xl p-4 border border-white/30 shadow-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-900">
              <div className="text-xs font-bold text-slate-700">
                Showing <span className="text-[#D0161D] font-black">{products.length}</span> items
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <label htmlFor="shop-sort-select" className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort By:</label>
                <select
                  id="shop-sort-select"
                  aria-label="Sort products by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold px-3 py-2 outline-none focus:border-red-500 text-slate-800"
                >
                  <option value="default">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-20 text-white font-bold">Loading catalog...</div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-white/20 shadow-xl">
                <p className="text-base font-bold text-slate-700">No products found for this filter.</p>
                <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="mt-4 px-5 py-2 bg-[#D0161D] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-red-800 transition">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
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
              <h4 className="text-sm font-black text-slate-900">Nationwide Shipping</h4>
              <p className="text-xs text-slate-500 mt-0.5">Fast delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">100% Genuine Care</h4>
              <p className="text-xs text-slate-500 mt-0.5">Direct from manufacturer</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Cash on Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Pay conveniently at doorstep</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Dedicated Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">We're here 24/7 to assist you</p>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}

export default function ShopClient() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <Suspense fallback={<div className="text-center py-20 text-xs font-bold text-slate-400">Loading catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
