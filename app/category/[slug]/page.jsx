'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(slug.replace(/-/g, ' '));
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchCategoryProducts();
  }, [slug]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?category=${slug}`);
      if (data.success) {
        setProducts(data.products);
        if (data.products.length > 0 && data.products[0].category?.name) {
          setCategoryName(data.products[0].category.name);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-8 mb-8 shadow-lg capitalize">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Category</span>
          <h1 className="text-3xl font-black mt-1">{categoryName}</h1>
          <p className="text-xs text-slate-300 mt-1">Explore authentic Kick Home Care solutions for {categoryName}.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold">Loading category products...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-base font-bold text-slate-700">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
