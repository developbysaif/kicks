'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ChevronRight,
  Filter,
  Sparkles,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Loader2,
  FolderTree,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import PageSection from '@/components/PageSection';

export default function ShopCatchAllPage({ params }) {
  // Support both Promise params (Next 15) and sync params (Next 14)
  const resolvedParams = React.use ? React.use(params) : params;
  const slugArray = resolvedParams?.slug || [];
  const router = useRouter();

  const categorySlug = slugArray[0] || '';
  const subcategorySlug = slugArray[1] || '';
  const productSlug = slugArray[2] || '';

  // If 3 segments (e.g. /shop/shoe-care/leather-care/product-slug), redirect to canonical /product/product-slug
  useEffect(() => {
    if (productSlug) {
      router.replace(`/product/${productSlug}`);
    }
  }, [productSlug, router]);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(subcategorySlug);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setActiveSubcategory(subcategorySlug);
  }, [subcategorySlug]);

  useEffect(() => {
    if (!categorySlug) return;
    fetchData();
  }, [categorySlug, activeSubcategory]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Build product query URL
      let prodUrl = `/api/products?category=${encodeURIComponent(categorySlug)}`;
      if (activeSubcategory) {
        prodUrl += `&subcategory=${encodeURIComponent(activeSubcategory)}`;
      }

      const [prodRes, catRes, subRes] = await Promise.all([
        axios.get(prodUrl).catch(() => null),
        axios.get('/api/categories').catch(() => null),
        axios.get(`/api/subcategories?category=${encodeURIComponent(categorySlug)}`).catch(() => null)
      ]);

      if (prodRes?.data?.success && Array.isArray(prodRes.data.products)) {
        setProducts(prodRes.data.products);
      } else {
        setProducts([]);
      }

      if (catRes?.data?.success && Array.isArray(catRes.data.categories)) {
        const foundCat = catRes.data.categories.find(
          (c) => c.slug === categorySlug || c._id === categorySlug
        );
        setCategory(foundCat || null);
      }

      if (subRes?.data?.success && Array.isArray(subRes.data.subcategories)) {
        setSubcategories(subRes.data.subcategories);
      } else {
        setSubcategories([]);
      }
    } catch (err) {
      console.error('Error fetching shop catalog data:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const currentSubcategoryObj = subcategories.find(
    (s) => s.slug === activeSubcategory || s._id === activeSubcategory
  );

  const categoryTitle =
    category?.name ||
    categorySlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const pageTitle = activeSubcategory && currentSubcategoryObj
    ? currentSubcategoryObj.name
    : categoryTitle;

  const pageDescription = activeSubcategory && currentSubcategoryObj?.description
    ? currentSubcategoryObj.description
    : category?.description || `Explore genuine Kick ${categoryTitle} formulations designed for superior performance.`;

  const bannerImage =
    (activeSubcategory && currentSubcategoryObj?.imageUrl) ||
    category?.image ||
    '/Shoe Care.png';

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    return result;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] font-sans">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/shop" className="hover:text-red-600 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href={categorySlug === 'shoe-care' ? '/shop/shoe-care' : `/shop/${categorySlug}`}
              className={`hover:text-red-600 transition-colors ${!activeSubcategory ? 'text-red-600 font-bold' : ''}`}
            >
              {categoryTitle}
            </Link>
            {activeSubcategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-red-600 font-bold">{pageTitle}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <main className="w-full flex-1">
        {/* 1. HERO BANNER — WHITE */}
        <PageSection variant="white" className="pt-6 pb-8">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[260px] sm:min-h-[320px] flex items-end"
            style={{
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />

            {/* Text content pinned to bottom */}
            <div className="relative z-10 p-8 sm:p-12 space-y-3 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D0161D] text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {activeSubcategory ? `${categoryTitle} • Subcategory` : 'Kick® Official Category'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                {pageDescription}
              </p>
            </div>
          </div>
        </PageSection>

        {/* 2. CATALOG PRODUCTS & CONTROLS — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="space-y-6">
            {/* Subcategory Filter Pills */}
            {subcategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setActiveSubcategory('');
                    router.push(`/shop/${categorySlug}`);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    !activeSubcategory
                      ? 'bg-white text-black font-black shadow-md'
                      : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
                  }`}
                >
                  All {categoryTitle}
                </button>
                {subcategories.map((sub) => {
                  const isActive = activeSubcategory === sub.slug;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => {
                        setActiveSubcategory(sub.slug);
                        router.push(`/shop/${categorySlug}/${sub.slug}`);
                      }}
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
                <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
                <select
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

            {/* Product Grid — White Cards on Red */}
            {loading ? (
              <div className="text-center py-20 text-white font-bold flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>Loading products...</span>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-white/20 shadow-xl max-w-lg mx-auto">
                <p className="text-base font-bold text-slate-800">
                  {activeSubcategory
                    ? `No products found in ${pageTitle}.`
                    : `No products found in ${categoryTitle}.`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Please check back soon or browse our other categories.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  {activeSubcategory && (
                    <button
                      onClick={() => {
                        setActiveSubcategory('');
                        router.push(`/shop/${categorySlug}`);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      View All {categoryTitle}
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
                <h4 className="text-sm font-black text-slate-900">Nationwide Shipping</h4>
                <p className="text-xs text-slate-500 mt-0.5">Reliable delivery across Pakistan</p>
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
                <p className="text-xs text-slate-500 mt-0.5">Pay safely at doorstep</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Customer Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">We are here to assist you</p>
              </div>
            </div>
          </div>
        </PageSection>
      </main>

      <Footer />
    </div>
  );
}
