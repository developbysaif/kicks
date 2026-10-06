'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Filter,
  Loader2,
  ExternalLink,
  ChevronDown,
  Layers,
  FolderTree,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminProductsPage() {
  const { user } = useAuth();

  // Products & Meta
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Delete modal confirmation
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const getHeaders = () => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  // Load initial Categories and Subcategories
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const headers = getHeaders();
        const [catRes, subRes] = await Promise.all([
          axios.get('/api/admin/categories', { headers }),
          axios.get('/api/admin/subcategories', { headers })
        ]);

        if (catRes.data?.success) {
          setCategories(catRes.data.categories || []);
        }
        if (subRes.data?.success) {
          setSubcategories(subRes.data.subcategories || []);
        }
      } catch (err) {
        console.error('Error fetching categories & subcategories:', err);
      }
    };
    fetchTaxonomies();
  }, [user]);

  // Fetch Products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedSubcategory !== 'all') params.set('subcategory', selectedSubcategory);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedStock !== 'all') params.set('stock', selectedStock);
      if (sortBy) params.set('sort', sortBy);
      params.set('limit', '100');

      const res = await axios.get(`/api/admin/products?${params.toString()}`, { headers });
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, selectedCategory, selectedSubcategory, selectedStatus, selectedStock, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Subcategories filtered for currently selected category
  const availableSubcategories = subcategories.filter((s) => {
    if (selectedCategory === 'all') return true;
    const parentId = s.categoryId?._id || s.categoryId;
    return parentId === selectedCategory;
  });

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('all');
  };

  // Toggle quick status
  const handleToggleStatus = async (product) => {
    try {
      const headers = getHeaders();
      const newStatus = product.status === 'published' ? 'draft' : 'published';
      await axios.put(
        '/api/admin/products',
        {
          _id: product._id,
          status: newStatus
        },
        { headers }
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product status');
    }
  };

  // Delete product action
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteMessage('');
      const headers = getHeaders();
      const res = await axios.delete(`/api/admin/products?id=${productToDelete._id}`, { headers });
      if (res.data?.success) {
        setProductToDelete(null);
        fetchProducts();
      } else {
        setDeleteMessage(res.data?.message || 'Failed to delete product');
      }
    } catch (err) {
      setDeleteMessage(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-red-600" />
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store&apos;s live database products, pricing, stock levels, and category assignments.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name, SKU, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">All Subcategories</option>
              {availableSubcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Status Count Badges & Results */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Found {products.length} products</span>
            {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || selectedStatus !== 'all' || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSelectedStatus('all');
                  setSelectedStock('all');
                }}
                className="text-red-600 hover:underline font-bold text-[11px]"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedStock(selectedStock === 'in-stock' ? 'all' : 'in-stock')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                selectedStock === 'in-stock'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setSelectedStock(selectedStock === 'out-of-stock' ? 'all' : 'out-of-stock')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                selectedStock === 'out-of-stock'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category / Subcategory</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-red-600" />
                    Loading catalog products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const imageSrc =
                    (Array.isArray(p.images) && p.images[0]) || p.image || '/Shoe Care.png';
                  const catName = p.categoryId?.name || p.category?.name || 'Uncategorized';
                  const subName = p.subcategoryId?.name || p.subcategory?.name || null;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Product image & name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 max-w-xs sm:max-w-sm">
                          <img
                            src={imageSrc}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">/{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Subcategory */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded-lg text-[10px]">
                            {catName}
                          </span>
                          {subName && (
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                              <span>↳</span>
                              <span className="text-red-700">{subName}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {p.sku || '—'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          ₨{p.salePrice || p.price}
                          {p.salePrice && (
                            <span className="block text-[10px] text-slate-400 line-through font-normal">
                              ₨{p.price}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.stock > 10
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.stock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {p.status === 'published' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{p.status || 'published'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex items-center transition-colors"
                          title="View on storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex items-center transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setProductToDelete(p);
                            setDeleteMessage('');
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg inline-flex items-center transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <span className="font-bold text-slate-800">&quot;{productToDelete.name}&quot;</span>?
              </p>
              <p className="text-[11px] text-slate-400">
                If this product is linked to past customer orders, it will be safely archived instead of permanently deleted to preserve invoice history.
              </p>
            </div>

            {deleteMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                {deleteMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
