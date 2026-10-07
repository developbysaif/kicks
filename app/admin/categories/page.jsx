'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  AlertCircle,
  Search,
  ExternalLink,
  X,
  Upload,
  RefreshCw,
  ImageIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import slugify from 'slugify';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('published');
  const [sortOrder, setSortOrder] = useState('0');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getHeaders = useCallback(() => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  }, [user?.token]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      const { data } = await axios.get('/api/admin/categories', { headers });
      if (data && data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching admin categories:', err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const handleNameChange = (val) => {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val, { lower: true, strict: true }));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setStatus('published');
    setSortOrder('0');
    setSeoTitle('');
    setSeoDescription('');
    setErrorMessage('');
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditingId(c._id);
    setName(c.name || '');
    setSlug(c.slug || '');
    setDescription(c.description || '');
    setImage(c.image || '');
    setStatus(c.status || 'published');
    setSortOrder(c.sortOrder !== undefined ? String(c.sortOrder) : '0');
    setSeoTitle(c.seoTitle || '');
    setSeoDescription(c.seoDescription || '');
    setErrorMessage('');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMessage('');
      const formData = new FormData();
      formData.append('file', file);

      const headers = getHeaders();
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data && data.url) {
        setImage(data.url);
      } else {
        setErrorMessage(data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Category name is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      const headers = getHeaders();
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name, { lower: true, strict: true }),
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        status,
        sortOrder: parseInt(sortOrder, 10) || 0,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim()
      };

      if (editingId) {
        payload._id = editingId;
        await axios.put('/api/admin/categories', payload, { headers });
      } else {
        await axios.post('/api/admin/categories', payload, { headers });
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if ((cat.subcategoryCount || 0) > 0) {
      alert(`Cannot delete "${cat.name}": ${cat.subcategoryCount} subcategory(s) exist under this category. Please reassign or delete subcategories first.`);
      return;
    }

    if ((cat.productCount || 0) > 0) {
      alert(`Cannot delete "${cat.name}": ${cat.productCount} product(s) are assigned to this category. Please reassign or delete products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const headers = getHeaders();
      await axios.delete(`/api/admin/categories?id=${cat._id}`, { headers });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(c => {
    if (!searchQuery.trim()) return true;
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.slug.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-red-600" />
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize main storefront departments, manage banners, subcategory relationships, and SEO.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
          Total: <span className="text-slate-900">{categories.length}</span> Categories
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-center">Subcategories</th>
                <th className="py-3.5 px-4 text-center">Products</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-red-500" />
                    <span>Loading categories...</span>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No categories found. Click &quot;Add New Category&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.image || '/shoe care.png'}
                          alt={c.name}
                          className="w-10 h-10 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/shoe care.png';
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          {c.description && (
                            <span className="text-[11px] text-slate-400 max-w-xs block truncate">
                              {c.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      <Link
                        href={`/shop/${c.slug}`}
                        target="_blank"
                        className="hover:text-red-600 inline-flex items-center gap-1 font-semibold"
                      >
                        {c.slug}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href="/admin/subcategories"
                        className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 transition-colors"
                      >
                        {c.subcategoryCount || 0} subcategories
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {c.productCount || 0} items
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {c.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIXED & RESPONSIVE MODAL: Category Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-hidden animate-fadeIn">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => !saving && setShowModal(false)}
          />

          {/* Modal Container with Max-Height & Fixed Header + Footer */}
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden z-10">
            
            {/* 1. Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {editingId ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {editingId ? 'Update details, banner image and SEO attributes' : 'Configure a new storefront category'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Modal Body (Scrollable form content) */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
                
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span className="font-medium leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {/* Category Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                    Category Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Washroom Cleaning"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                  />
                </div>

                {/* Slug (URL) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">
                      Slug (URL)
                    </label>
                    <span className="text-[10px] text-slate-400">Auto-generated or custom</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. washroom-cleaning"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    />
                  </div>
                  {slug && (
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Preview: <span className="text-slate-600">/shop/{slug}</span>
                    </p>
                  )}
                </div>

                {/* Banner Image URL & File Upload */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                    Banner Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                      placeholder="/images/... or https://..."
                    />
                    <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 transition shrink-0 border border-slate-200">
                      {uploading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Image Preview Thumbnail */}
                  {image && (
                    <div className="mt-2.5 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-28 w-full group">
                      <img
                        src={image}
                        alt="Category banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/shoe care.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="text-[11px] text-white font-medium bg-black/60 px-2.5 py-1 rounded-lg">Preview</span>
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="text-[11px] text-white font-bold bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-lg cursor-pointer transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short summary of products and cleaning solutions in this category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition leading-relaxed"
                  />
                </div>

                {/* Status & Sort Order */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                {/* SEO Fields Section */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600">
                      SEO Optimization (Optional)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">SEO Title</label>
                    <input
                      type="text"
                      placeholder="Title tag displayed in search engines"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">SEO Description</label>
                    <textarea
                      rows={2}
                      placeholder="Meta description displayed in search results..."
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition leading-relaxed"
                    />
                  </div>
                </div>

              </div>

              {/* 3. Modal Footer (Sticky at bottom, always 100% visible and clickable) */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-xs"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Category...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Category' : 'Create Category'}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
