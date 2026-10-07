'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  AlertCircle,
  Search,
  Filter,
  X,
  Upload,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import slugify from 'slugify';

export default function AdminSubcategoriesPage() {
  const { user } = useAuth();
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      const [catsRes, subcatsRes] = await Promise.all([
        axios.get('/api/admin/categories', { headers }),
        axios.get('/api/admin/subcategories', { headers })
      ]);

      if (catsRes.data?.success) {
        setCategories(catsRes.data.categories || []);
      }
      if (subcatsRes.data?.success) {
        setSubcategories(subcatsRes.data.subcategories || []);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
    setCategoryId(categories[0]?._id || '');
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setStatus('published');
    setSortOrder('0');
    setSeoTitle('');
    setSeoDescription('');
    setErrorMessage('');
    setShowModal(true);
  };

  const openEditModal = (sub) => {
    setEditingId(sub._id);
    setCategoryId(sub.categoryId?._id || sub.categoryId || '');
    setName(sub.name || '');
    setSlug(sub.slug || '');
    setDescription(sub.description || '');
    setImageUrl(sub.imageUrl || '');
    setStatus(sub.status || 'published');
    setSortOrder(sub.sortOrder !== undefined ? String(sub.sortOrder) : '0');
    setSeoTitle(sub.seoTitle || '');
    setSeoDescription(sub.seoDescription || '');
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
        setImageUrl(data.url);
      } else {
        setErrorMessage(data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Subcategory name is required.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Parent category must be selected.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      const headers = getHeaders();
      const payload = {
        categoryId,
        name: name.trim(),
        slug: slug.trim() || slugify(name, { lower: true, strict: true }),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        status,
        sortOrder: parseInt(sortOrder, 10) || 0,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim()
      };

      if (editingId) {
        payload._id = editingId;
        await axios.put('/api/admin/subcategories', payload, { headers });
      } else {
        await axios.post('/api/admin/subcategories', payload, { headers });
      }

      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save subcategory');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sub) => {
    if ((sub.productCount || 0) > 0) {
      alert(`Cannot delete "${sub.name}": ${sub.productCount} product(s) are assigned to this subcategory. Please reassign or delete those products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) return;

    try {
      const headers = getHeaders();
      await axios.delete(`/api/admin/subcategories?id=${sub._id}`, { headers });
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  // Filter Subcategories by Category and Search Text
  const filteredSubcategories = subcategories.filter((sub) => {
    const parentId = sub.categoryId?._id || sub.categoryId;
    const matchesCat = selectedCatFilter === 'all' || parentId === selectedCatFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.categoryId?.name && sub.categoryId.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-red-600" />
            Subcategory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and organize targeted product classifications mapped to parent departments.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subcategory</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Parent Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">All Parent Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subcategory or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
          Total: <span className="text-slate-900">{filteredSubcategories.length}</span> Subcategories
        </div>
      </div>

      {/* Subcategories Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Subcategory</th>
                <th className="py-3.5 px-4">Parent Category</th>
                <th className="py-3.5 px-4">Slug</th>
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
                    <span>Loading subcategories...</span>
                  </td>
                </tr>
              ) : filteredSubcategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No subcategories found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={sub.imageUrl || '/shoe care.png'}
                          alt={sub.name}
                          className="w-10 h-10 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/shoe care.png';
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.name}</span>
                          {sub.description && (
                            <span className="text-[11px] text-slate-400 max-w-xs block truncate">
                              {sub.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
                        {sub.categoryId?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {sub.slug}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {sub.productCount || 0} items
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {sub.status || 'published'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(sub)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit Subcategory"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Subcategory"
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

      {/* FIXED & RESPONSIVE MODAL: Subcategory Add / Edit */}
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
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {editingId ? 'Edit Subcategory' : 'Add New Subcategory'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {editingId ? 'Update subcategory classifications and details' : 'Configure a new product subcategory'}
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

                {/* Parent Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                    Parent Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                  >
                    <option value="" disabled>Select parent category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                      Subcategory Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Leather Care"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                      Slug (URL path)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. leather-care"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                {/* Banner Image URL & File Upload */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider">
                    Banner Image URL (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
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
                  {imageUrl && (
                    <div className="mt-2.5 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-28 w-full group">
                      <img
                        src={imageUrl}
                        alt="Subcategory banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/shoe care.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="text-[11px] text-white font-medium bg-black/60 px-2.5 py-1 rounded-lg">Preview</span>
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
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
                    placeholder="Short summary of products in this subcategory..."
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
                      SEO Metadata (Optional)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Meta title for search engines..."
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      placeholder="Meta description for search engine listings..."
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
                      <span>Saving Subcategory...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Subcategory' : 'Create Subcategory'}</span>
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
