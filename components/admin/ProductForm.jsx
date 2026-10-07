'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import slugify from 'slugify';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Check,
  Star,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Trash2,
  Layers,
  FolderTree
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug));
  const [sku, setSku] = useState(initialData?.sku || '');
  const [brand, setBrand] = useState(initialData?.brand || 'Kick Home Care');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Category & Subcategory State
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId?._id || initialData?.categoryId || initialData?.category?._id || initialData?.category || ''
  );
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState(
    initialData?.subcategoryId?._id || initialData?.subcategoryId || initialData?.subcategory?._id || initialData?.subcategory || ''
  );
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Pricing
  const [price, setPrice] = useState(initialData?.price !== undefined ? initialData.price : '');
  const [salePrice, setSalePrice] = useState(initialData?.salePrice !== undefined ? initialData.salePrice : '');
  const [costPrice, setCostPrice] = useState(initialData?.costPrice !== undefined ? initialData.costPrice : '');

  // Inventory
  const [stock, setStock] = useState(initialData?.stock !== undefined ? initialData.stock : 100);
  const [trackInventory, setTrackInventory] = useState(initialData?.trackInventory !== undefined ? initialData.trackInventory : true);
  const [allowBackorders, setAllowBackorders] = useState(initialData?.allowBackorders !== undefined ? initialData.allowBackorders : false);

  // Images
  const [images, setImages] = useState(
    Array.isArray(initialData?.images) && initialData.images.length > 0
      ? initialData.images
      : initialData?.image
      ? [initialData.image]
      : []
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Visibility & SEO
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : initialData?.tags || ''
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');

  // Status & Errors
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const getHeaders = useCallback(() => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  }, [user?.token]);

  // Load Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoadingCats(true);
        const res = await axios.get('/api/admin/categories', { headers: getHeaders() });
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
          // If no category selected yet, pick the first one
          if (res.data.categories.length > 0) {
            setCategoryId((prev) => prev || res.data.categories[0]._id);
          }
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, [getHeaders]);

  // Load Subcategories when category changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setSubcategoryId('');
      return;
    }

    const fetchSubcats = async () => {
      try {
        setLoadingSubcategories(true);
        const res = await axios.get(`/api/subcategories?category=${categoryId}`);
        if (res.data?.success && Array.isArray(res.data.subcategories)) {
          setSubcategories(res.data.subcategories);
          // If current subcategoryId doesn't belong to new list, reset it
          setSubcategoryId((prevSub) => {
            if (isEdit && prevSub) return prevSub;
            const stillValid = res.data.subcategories.some(
              (s) => s._id === prevSub || s.slug === prevSub
            );
            return stillValid ? prevSub : '';
          });
        } else {
          setSubcategories([]);
          setSubcategoryId('');
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubcats();
  }, [categoryId, isEdit]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(slugify(val, { lower: true, strict: true }));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugManual(true);
  };

  // Upload Images
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target?.files || []);
    if (files.length === 0) return;

    const remainingSlots = 6 - images.length;
    if (remainingSlots <= 0) {
      alert('Maximum 6 images allowed per product.');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    setIsUploading(true);
    setFormError('');

    try {
      const formData = new FormData();
      filesToUpload.forEach((f) => formData.append('files', f));

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && Array.isArray(res.data.urls)) {
        setImages((prev) => [...prev, ...res.data.urls].slice(0, 6));
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('Direct upload error, falling back to FileReader:', err);
      // Fallback: Read as base64
      const readers = filesToUpload.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      });
      const dataUrls = await Promise.all(readers);
      const valid = dataUrls.filter(Boolean);
      if (valid.length > 0) {
        setImages((prev) => [...prev, ...valid].slice(0, 6));
      } else {
        setFormError('Failed to upload image. Please try entering an image URL.');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (images.length >= 6) {
      alert('Maximum 6 images allowed per product.');
      return;
    }
    setImages((prev) => [...prev, imageUrlInput.trim()].slice(0, 6));
    setImageUrlInput('');
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCover = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const [promoted] = updated.splice(index, 1);
      return [promoted, ...updated];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!categoryId) {
      setFormError('Please select a Category.');
      return;
    }
    if (price === '' || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      setFormError('A valid regular price is required.');
      return;
    }

    try {
      setSaving(true);
      const headers = getHeaders();
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name, { lower: true, strict: true }),
        sku: sku.trim(),
        brand: brand.trim() || 'Kick Home Care',
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        categoryId,
        subcategoryId: subcategoryId || null,
        price: parseFloat(price),
        salePrice: salePrice !== '' && !isNaN(parseFloat(salePrice)) ? parseFloat(salePrice) : null,
        costPrice: costPrice !== '' && !isNaN(parseFloat(costPrice)) ? parseFloat(costPrice) : null,
        stock: parseInt(stock, 10) || 0,
        trackInventory: Boolean(trackInventory),
        allowBackorders: Boolean(allowBackorders),
        images: images.length > 0 ? images : ['/Shoe Care.png'],
        status,
        isActive: status === 'published',
        isFeatured: Boolean(isFeatured),
        tags: tags
          ? tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim()
      };

      let res;
      if (isEdit && initialData?._id) {
        payload._id = initialData._id;
        res = await axios.put('/api/admin/products', payload, { headers });
      } else {
        res = await axios.post('/api/admin/products', payload, { headers });
      }

      if (res.data?.success) {
        setFormSuccess(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
        setTimeout(() => {
          router.push('/admin/products');
        }, 800);
      } else {
        throw new Error(res.data?.message || 'Operation failed');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEdit
                ? `Update product details, pricing, and category mapping for ${name || 'item'}.`
                : 'Create a new catalog item with database-backed category and subcategory links.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{formSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              1. Basic Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kick Sneaker Cleaner Liquid 150ml"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Slug (URL) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="kick-sneaker-cleaner-liquid-150ml"
                  value={slug}
                  onChange={handleSlugChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  placeholder="e.g. KICK-SNK-150"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="Kick Home Care"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="sneakers, cleaning, shine, footwear"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary</label>
              <input
                type="text"
                placeholder="Brief one-line overview shown on product cards..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Description</label>
              <textarea
                rows={5}
                placeholder="Detailed description, directions for use, key benefits, specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* 2. Media / Images */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                2. Product Images ({images.length}/6)
              </h2>
              <span className="text-[11px] text-slate-400">First image is the Main Cover photo</span>
            </div>

            {/* Dropzone / Upload button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || images.length >= 6}
                className="flex-1 py-4 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl bg-slate-50 hover:bg-red-50/30 flex flex-col items-center justify-center gap-1.5 transition-all text-slate-600 hover:text-red-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                ) : (
                  <UploadCloud className="w-5 h-5 text-red-500" />
                )}
                <span className="text-xs font-bold">
                  {isUploading ? 'Uploading Image...' : 'Click to Upload Images from Device'}
                </span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP supported</span>
              </button>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste an image URL (e.g. /shoe care.png or https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={!imageUrlInput.trim() || images.length >= 6}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square"
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Cover
                      </span>
                    )}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsCover(idx)}
                          className="px-1.5 py-0.5 bg-white text-slate-900 rounded text-[9px] font-bold shadow hover:bg-red-600 hover:text-white"
                          title="Set as Cover Image"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              3. Pricing (PKR)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Regular Price (PKR) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₨
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    placeholder="250"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sale Price (PKR) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₨
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="220"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cost Per Item <span className="text-slate-400 font-normal">(Internal)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₨
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="150"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. SEO Metadata */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              4. Search Engine Optimization (SEO)
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Title</label>
              <input
                type="text"
                placeholder="Product Name | Buy Online at Best Price in Pakistan | Kick"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Description</label>
              <textarea
                rows={2}
                placeholder="Purchase genuine Kick products with fast cash on delivery across Pakistan..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Categorization & Status */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Status & Visibility
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="published">Published (Visible on store)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived (Unlisted)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800">Featured Product</span>
                <span className="text-[11px] text-slate-400">Show on Home Page highlights</span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Categorization
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCats}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
              >
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Subcategory</label>
                {loadingSubcategories && (
                  <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading
                  </span>
                )}
              </div>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={loadingSubcategories || subcategories.length === 0}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
              >
                <option value="">
                  {subcategories.length === 0
                    ? '-- No subcategories in this category --'
                    : '-- None / Select Subcategory --'}
                </option>
                {subcategories.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Subcategories cascade dynamically from the selected category.
              </p>
            </div>
          </div>

          {/* Inventory Management */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Inventory & Stock
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Available Stock Units
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700">Track Inventory</span>
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700">Allow Backorders</span>
                <input
                  type="checkbox"
                  checked={allowBackorders}
                  onChange={(e) => setAllowBackorders(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
