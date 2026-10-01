'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { Filter } from 'lucide-react';

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery]);

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

  const fetchProducts = async () => {
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
  };

  return (
    <>
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Title */}
        <div className="bg-gradient-to-r from-slate-900 to-red-950 text-white rounded-3xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-black">All Kick Products Catalog</h1>
          <p className="text-xs text-slate-300 mt-1 font-medium">Browse Pakistan's premier home care & shoe maintenance formulations.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-600" />
                <span>Categories</span>
              </h3>

              <div className="space-y-2 text-xs font-semibold">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-red-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All Products
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${selectedCategory === c.slug ? 'bg-red-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <section className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs font-bold text-slate-600">
                Showing <span className="text-red-600">{products.length}</span> items
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold px-3 py-2 outline-none focus:border-red-500"
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
              <div className="text-center py-20 text-slate-400 font-bold">Loading catalog...</div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-base font-bold text-slate-700">No products found for this filter.</p>
                <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="mt-4 px-5 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-sm">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default function ShopPage() {
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
