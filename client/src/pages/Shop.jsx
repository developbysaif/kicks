import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';
import API, { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const Shop = () => {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(FALLBACK_PRODUCTS.length);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, minRating, sort, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      if (Array.isArray(data) && data.length > 0) setCategories(data);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchProducts = async () => {
    try {
      let query = `/products?page=${page}&limit=12&sort=${sort}`;
      if (selectedCategory) query += `&category=${selectedCategory}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;
      if (minRating) query += `&minRating=${minRating}`;

      const { data } = await API.get(query);
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
        setTotalPages(data.pages || 1);
        setTotalCount(data.totalProducts || data.products.length);
      }
    } catch (err) {
      console.warn('Using fallback products for Shop page:', err);
      let filtered = [...FALLBACK_PRODUCTS];
      if (selectedCategory) filtered = filtered.filter(p => p.category?.slug === selectedCategory);
      setProducts(filtered);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Complete Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Shop All Products</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Browse high quality cleaning agents, laundry bleach, shoe polishes, and pest control solutions.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>
          <span className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{products.length}</strong> of {totalCount} products
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Popularity</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-card h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Filter Catalog</span>
            </h3>
            <button onClick={handleResetFilters} className="text-[11px] text-emerald-600 hover:underline font-semibold flex items-center space-x-1">
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${selectedCategory === '' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => { setSelectedCategory(c.slug); setPage(1); }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${selectedCategory === c.slug ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 z-10">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase">Categories</h4>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                    className="block w-full text-left py-1 text-xs text-slate-600 hover:text-emerald-600"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <main className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Shop;
