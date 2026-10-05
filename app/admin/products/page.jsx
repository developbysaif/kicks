'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  UploadCloud,
  Image as ImageIcon,
  X,
  Check,
  Star,
  AlertCircle,
  ChevronDown,
  Search,
  Filter,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_WEBSITE_CATEGORIES = [
  { _id: 'cat_shoe', name: 'Shoe Care', slug: 'shoe-care', icon: '👟' },
  { _id: 'cat_laundry', name: 'Laundry Care', slug: 'laundry-care', icon: '🧺' },
  { _id: 'cat_home', name: 'Home Cleaning', slug: 'home-cleaning', icon: '🧼' },
  { _id: 'cat_dish', name: 'Dish Care', slug: 'dish-care', icon: '🍽️' },
  { _id: 'cat_washroom', name: 'Washroom Cleaning', slug: 'washroom-cleaning', icon: '🚿' },
  { _id: 'cat_mosquito', name: 'Mosquito Protection', slug: 'mosquito-protection', icon: '🦟' }
];

export default function AdminProductsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([
    {
      _id: 'p_1',
      name: 'Kick Whito - White Sneaker & Joggers Cleaner',
      sku: 'KICK-WHITO-100',
      category: { name: 'Shoe Care', slug: 'shoe-care' },
      price: 250,
      salePrice: 220,
      stock: 150,
      images: ['/Shoe Care.png']
    },
    {
      _id: 'p_2',
      name: 'Kick Bleach Liquid Ultra Clean 500ml',
      sku: 'KICK-BLC-500',
      category: { name: 'Laundry Care', slug: 'laundry-care' },
      price: 250,
      salePrice: 220,
      stock: 150,
      images: ['/laundry Care.png']
    },
    {
      _id: 'p_3',
      name: 'Kick Dish Wash Liquid Lemon Fresh 500ml',
      sku: 'KICK-DISH-500',
      category: { name: 'Dish Care', slug: 'dish-care' },
      price: 320,
      salePrice: 280,
      stock: 140,
      images: ['/dish care.png']
    }
  ]);

  const [categories, setCategories] = useState(DEFAULT_WEBSITE_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Form modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('100');
  const [images, setImages] = useState([]);
  
  // Media upload & URL state
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/products', { timeout: 6000 }).catch(() => null),
        axios.get('/api/categories', { timeout: 6000 }).catch(() => null)
      ]);

      if (prodRes?.data?.success && Array.isArray(prodRes.data.products) && prodRes.data.products.length > 0) {
        setProducts(prodRes.data.products);
      }

      if (catRes?.data?.success && Array.isArray(catRes.data.categories) && catRes.data.categories.length > 0) {
        setCategories(catRes.data.categories);
        // Pre-select first category if currently unselected
        setCategoryId(prev => prev || catRes.data.categories[0]._id);
      } else {
        setCategories(DEFAULT_WEBSITE_CATEGORIES);
        setCategoryId(prev => prev || DEFAULT_WEBSITE_CATEGORIES[0]._id);
      }
    } catch (err) {
      console.error('Error fetching admin products data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setSalePrice('');
    setStock('100');
    setImages([]);
    setUrlInput('');
    setShowUrlInput(false);
    setFormError('');
    // Automatically select the first available category
    const initialCatId = categories.length > 0 ? categories[0]._id : (DEFAULT_WEBSITE_CATEGORIES[0]?._id || '');
    setCategoryId(initialCatId);
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p._id);
    setName(p.name || '');
    setDescription(p.description || '');
    
    // Resolve category id
    const resolvedCatId = p.categoryId || p.category?._id || (typeof p.category === 'string' ? p.category : (categories[0]?._id || ''));
    setCategoryId(resolvedCatId);
    
    setPrice(p.price !== undefined ? p.price : '');
    setSalePrice(p.salePrice || '');
    setStock(p.stock !== undefined ? p.stock : '100');
    
    // Load existing images (up to 4)
    let prodImages = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      prodImages = p.images.filter(Boolean);
    } else if (p.image) {
      prodImages = [p.image];
    }
    setImages(prodImages.slice(0, 4));
    
    setUrlInput('');
    setShowUrlInput(false);
    setFormError('');
    setShowModal(true);
  };

  // Upload images from computer (handles 1 to 4 images)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target?.files || []);
    if (files.length === 0) return;

    const currentCount = images.length;
    const remainingSlots = 4 - currentCount;

    if (remainingSlots <= 0) {
      alert('You can upload up to 4 images per product.');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(`Only ${remainingSlots} more image(s) allowed. Uploading the first ${remainingSlots}.`);
    }

    setIsUploading(true);
    setFormError('');

    try {
      const formData = new FormData();
      filesToUpload.forEach(f => formData.append('files', f));

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && Array.isArray(res.data.urls) && res.data.urls.length > 0) {
        setImages(prev => [...prev, ...res.data.urls].slice(0, 4));
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('Direct upload error, falling back to base64 reader:', err.message);
      // Fallback: Read files as Data URLs locally
      const readers = filesToUpload.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      });
      const dataUrls = await Promise.all(readers);
      const validUrls = dataUrls.filter(Boolean);
      if (validUrls.length > 0) {
        setImages(prev => [...prev, ...validUrls].slice(0, 4));
      } else {
        setFormError('Failed to upload image. Please try again or paste an image URL.');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setAsCoverImage = (indexToPromote) => {
    setImages(prev => {
      const selected = prev[indexToPromote];
      const remaining = prev.filter((_, idx) => idx !== indexToPromote);
      return [selected, ...remaining];
    });
  };

  const handleAddUrlImage = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= 4) {
      alert('Maximum 4 images allowed.');
      return;
    }
    setImages(prev => [...prev, urlInput.trim()].slice(0, 4));
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a product title.');
      return;
    }
    if (!categoryId) {
      setFormError('Please select a product category.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setFormError('Please enter a valid regular price.');
      return;
    }
    if (images.length === 0) {
      setFormError('Please upload at least 1 image (up to 4 images) from your computer or URL.');
      return;
    }

    try {
      setIsSaving(true);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      
      const payload = {
        name: name.trim(),
        description: description.trim() || `${name.trim()} - Premium quality cleaning & care product from Kick.`,
        category: categoryId,
        categoryId: categoryId,
        price: Number(price),
        salePrice: Number(salePrice) || 0,
        stock: Number(stock) || 0,
        images: images.length > 0 ? images : ['/Shoe Care.png']
      };

      if (editingId) {
        payload._id = editingId;
        await axios.put('/api/admin/products', payload, { headers });
      } else {
        await axios.post('/api/admin/products', payload, { headers });
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/api/admin/products?id=${id}`, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategoryFilter === 'all') return matchesSearch;
    const catName = p.category?.name || p.category;
    const catSlug = p.category?.slug || '';
    return matchesSearch && (
      catName?.toLowerCase() === selectedCategoryFilter.toLowerCase() ||
      catSlug.toLowerCase() === selectedCategoryFilter.toLowerCase()
    );
  });

  // Calculate discount percentage helper
  const discountPercent = (regular, sale) => {
    if (!sale || sale >= regular) return null;
    return Math.round(((regular - sale) / regular) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Products Catalog</h1>
              <p className="text-xs text-slate-500">Manage products, pricing, multi-image gallery & inventory stock.</p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map(c => (
            <button
              key={c._id || c.slug}
              onClick={() => setSelectedCategoryFilter(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryFilter.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
              <th className="py-3 px-3">Product</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Stock</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Package className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <p className="font-bold text-slate-600">No products found</p>
                    <p className="text-[11px] text-slate-400">Try changing your search or add a new product.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => {
                const discount = discountPercent(p.price, p.salePrice);
                const imageCount = Array.isArray(p.images) ? p.images.length : (p.image ? 1 : 0);
                const coverImg = p.images?.[0] || p.image || '/Shoe Care.png';

                return (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 shrink-0 rounded-xl bg-slate-50 p-1 border border-slate-200/80 flex items-center justify-center overflow-hidden">
                          <img
                            src={coverImg}
                            alt={p.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = '/Shoe Care.png'; }}
                          />
                          {imageCount > 1 && (
                            <span className="absolute bottom-0 right-0 bg-slate-900/80 text-[9px] font-bold text-white px-1 py-0.2 rounded-tl-md">
                              +{imageCount}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">{p.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-400">SKU: {p.sku || 'N/A'}</span>
                            {imageCount > 0 && (
                              <span className="text-[10px] text-slate-400">• {imageCount} {imageCount === 1 ? 'image' : 'images'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-100">
                        {p.category?.name || (typeof p.category === 'string' ? p.category : 'Category')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">
                          Rs. {p.salePrice > 0 ? p.salePrice : p.price}
                        </span>
                        {p.salePrice > 0 && p.salePrice < p.price && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 line-through">Rs. {p.price}</span>
                            {discount && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                                -{discount}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        p.stock > 20
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : p.stock > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.stock > 20 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Styled Product Modal - Complete UI with Fixed Header, Scrollable Body & Sticky Footer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
            {/* 1. Modal Header (Pinned at top - Never cut off) */}
            <div className="shrink-0 px-6 py-4 sm:px-7 sm:py-4.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {editingId ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fill in details, select store category, and upload 3-4 images.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form wrapping body and sticky footer */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden min-h-0">
              {/* 2. Scrollable Modal Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7 sm:py-6 space-y-4">
                {/* Error Alert */}
                {formError && (
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Product Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kick Whito - White Sneaker & Joggers Cleaner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Predefined store website categories
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full appearance-none px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all pr-10 cursor-pointer shadow-sm"
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.slug} value={c._id || c.name} className="font-semibold text-slate-800 py-1">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Pricing & Stock Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Regular Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Regular Price (Rs.) <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">Rs.</span>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="350"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Sale Price */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Sale Price (Rs.)
                      </label>
                      {discountPercent(Number(price), Number(salePrice)) && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          -{discountPercent(Number(price), Number(salePrice))}%
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="299"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Stock Quantity <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="100"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Product Images (Upload from Computer & Gallery) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Product Images <span className="text-red-600">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {images.length} / 4 uploaded
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      {showUrlInput ? 'Hide URL Input' : '+ Add via URL'}
                    </button>
                  </div>

                  {/* Optional URL Input */}
                  {showUrlInput && (
                    <div className="flex gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-200">
                      <input
                        type="url"
                        placeholder="https://example.com/product-image.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrlImage}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Add Image
                      </button>
                    </div>
                  )}

                  {/* Upload Drag & Drop Zone */}
                  {images.length < 4 && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-red-500 bg-red-50/50 scale-[0.99]'
                          : 'border-slate-300 hover:border-red-500 bg-slate-50/60 hover:bg-red-50/20'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                          <Loader2 className="w-7 h-7 text-red-600 animate-spin" />
                          <span className="text-xs font-bold text-slate-700">Uploading images from computer...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center shadow-sm">
                            <UploadCloud className="w-5 h-5 stroke-[2]" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                              Upload images from your computer
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Click to browse or drag & drop (select 3 to 4 images at once)
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-200/80 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">
                            <ImageIcon className="w-3 h-3 text-red-500" />
                            <span>JPG, PNG, WEBP (Max 4 images)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Uploaded Images Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {images.map((imgUrl, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square rounded-2xl border-2 border-slate-200/90 overflow-hidden bg-white shadow-sm flex items-center justify-center p-1.5"
                        >
                          <img
                            src={imgUrl}
                            alt={`Product thumbnail ${index + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = '/Shoe Care.png'; }}
                          />

                          {/* Position Badge */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            {index === 0 ? (
                              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Cover
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 bg-slate-900/70 text-white text-[9px] font-bold rounded-md backdrop-blur-sm">
                                #{index + 1}
                              </span>
                            )}
                          </div>

                          {/* Hover Overlay Actions */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => setAsCoverImage(index)}
                                title="Set as Main Cover"
                                className="p-1.5 bg-white hover:bg-amber-50 text-amber-600 rounded-xl shadow-md transition-transform hover:scale-110"
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              title="Remove image"
                              className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 rounded-xl shadow-md transition-transform hover:scale-110"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add More Slot */}
                      {images.length < 4 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50 hover:bg-red-50/20 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-red-600 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          <span className="text-[10px] font-bold">Add #{images.length + 1}</span>
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Tip: Upload 3 to 4 images. The first image marked as &quot;Cover&quot; will be shown on the catalog card.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detail the product key benefits, directions for use, volume/weight, and care instructions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* 3. Sticky Modal Footer (Pinned at bottom - Never cut off) */}
              <div className="shrink-0 px-6 py-3.5 sm:px-7 border-t border-slate-100 bg-slate-50/90 backdrop-blur-sm flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                  * Fields marked with red asterisk are required
                </span>

                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-red-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Save Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
