'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, FolderTree, AlertCircle, Search, Filter } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState('');

  const getHeaders = () => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
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
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      setErrorMessage('Please select a parent category.');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please provide a subcategory name.');
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
      setErrorMessage(err.response?.data?.message || 'Failed to save subcategory.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sub) => {
    if (sub.productCount > 0) {
      alert(`Cannot delete "${sub.name}": ${sub.productCount} product(s) are currently assigned to this subcategory. Please reassign or delete the products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) return;

    try {
      const headers = getHeaders();
      await axios.delete(`/api/admin/subcategories?id=${sub._id}`, { headers });
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subcategory.');
    }
  };

  const filteredSubcategories = subcategories.filter(sub => {
    const parentId = sub.categoryId?._id || sub.categoryId;
    const matchCat = selectedCatFilter === 'all' || parentId === selectedCatFilter;
    const matchSearch = !searchQuery.trim() || 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-red-600" />
            Subcategory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize nested product groupings under parent categories with dynamic storefront routing.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subcategory</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Filter by Parent:</span>
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="all">All Categories ({subcategories.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3 px-4">Subcategory</th>
                <th className="py-3 px-4">Parent Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4 text-center">Products</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading subcategories...
                  </td>
                </tr>
              ) : filteredSubcategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No subcategories found. Click &quot;Add New Subcategory&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {sub.imageUrl ? (
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            className="w-9 h-9 object-cover rounded-lg border border-slate-200 bg-slate-50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                            {sub.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{sub.name}</p>
                          {sub.description && (
                            <p className="text-[11px] text-slate-400 max-w-xs truncate">{sub.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg border border-red-100 text-[11px]">
                        {sub.categoryId?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {sub.slug}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        (sub.productCount || 0) > 0 ? 'bg-slate-100 text-slate-800' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {sub.productCount || 0}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Edit Subcategory"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
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

      {/* Modal: Add / Edit Subcategory */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-100 my-8">
            <h3 className="text-lg font-black text-slate-900">
              {editingId ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Parent Category <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="" disabled>Select parent category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Subcategory Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather Care"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Slug (URL path)
                </label>
                <input
                  type="text"
                  placeholder="e.g. leather-care"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="/images/... or https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short subcategory description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <p className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">SEO Metadata (Optional)</p>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    placeholder="Meta title for search engines..."
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    placeholder="Meta description..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Subcategory' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
