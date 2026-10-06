'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Image as ImageIcon,
  Calendar,
  AlertCircle,
  FileText,
  Layers,
  Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_BLOG_POSTS } from '@/lib/blogData';

const PRESET_IMAGES = [
  { label: 'Shoe Cleaning Setup', url: '/shoes cleaning.jpg.jpeg' },
  { label: 'Shoe Care Hero', url: '/shoe-care-hero.jpg' },
  { label: 'Washroom Cleaning', url: '/Washroom CLeaning.jpg.jpeg' },
  { label: 'Quality & Lab', url: '/about-quality-lab.jpg' },
  { label: 'Home Living Care', url: '/about-cta-home.jpg' },
  { label: 'Shoe Promo Banner', url: '/promo-shoe.jpg' },
  { label: 'Clean Home Banner', url: '/promo-clean.jpg' },
  { label: 'Laundry Care', url: '/laundry Care.png' },
  { label: 'Dish Wash Care', url: '/dish care.png' }
];

const CATEGORIES = [
  'Shoe Care',
  'Washroom Cleaning',
  'Laundry Care',
  'Home Hygiene',
  'Sneaker Restoration',
  'Leather Craft'
];

export default function AdminBlogsPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionAlert, setActionAlert] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Shoe Care',
    excerpt: '',
    content: '',
    coverImageUrl: '/shoes cleaning.jpg.jpeg',
    authorName: 'Kick Care Experts',
    readTime: '4 min read',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    status: 'published'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const { data } = await axios.get('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else {
        setPosts(INITIAL_BLOG_POSTS);
      }
    } catch (err) {
      setPosts(INITIAL_BLOG_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Shoe Care',
      excerpt: '',
      content: '',
      coverImageUrl: '/shoes cleaning.jpg.jpeg',
      authorName: 'Kick Care Experts',
      readTime: '4 min read',
      tags: 'Shoe Care, Cleaners, Kick Care',
      seoTitle: '',
      seoDescription: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Shoe Care',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImageUrl: post.coverImageUrl || '/shoes cleaning.jpg.jpeg',
      authorName: post.authorName || 'Kick Care Experts',
      readTime: post.readTime || '4 min read',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      status: post.status || 'published'
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val) => {
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || !editingPost ? slugified : prev.slug,
      seoTitle: prev.seoTitle === '' || !editingPost ? val : prev.seoTitle
    }));
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setActionAlert({ type: 'error', message: 'Article title and content are required' });
      return;
    }

    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };

      if (editingPost && editingPost._id && !editingPost._id.startsWith('blog-')) {
        // Update via API
        const { data } = await axios.put(`/api/admin/blogs/${editingPost._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setActionAlert({ type: 'success', message: 'Article updated successfully!' });
        }
      } else {
        // Create via API
        const { data } = await axios.post('/api/admin/blogs', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setActionAlert({ type: 'success', message: 'Article published successfully!' });
        }
      }

      setIsModalOpen(false);
      fetchBlogs();
      setTimeout(() => setActionAlert({ type: '', message: '' }), 4000);
    } catch (err) {
      setActionAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save article. Please verify admin privileges.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!id.startsWith('blog-')) {
        await axios.delete(`/api/admin/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setActionAlert({ type: 'success', message: 'Article removed successfully.' });
      setTimeout(() => setActionAlert({ type: '', message: '' }), 3500);
    } catch (err) {
      setActionAlert({ type: 'error', message: 'Failed to delete article.' });
    }
  };

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (!post._id.startsWith('blog-')) {
        await axios.put(
          `/api/admin/blogs/${post._id}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.warn('Status toggle error:', err);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [posts, statusFilter, searchQuery]);

  // Metrics
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const categoriesCount = new Set(posts.map((p) => p.category)).size;

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. TOP TITLE & METRICS OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-7 bg-red-600 rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Blog & Care Guides Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Publish SEO-optimized tutorials, sneaker cleaning guides, and household hygiene insights.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-3 bg-[#D0161D] hover:bg-red-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Global Alerts */}
      {actionAlert.message && (
        <div
          className={`p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-fadeIn ${
            actionAlert.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {actionAlert.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* 2. 4 STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Articles</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Published Live</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{publishedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Draft Status</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{draftCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Categories</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{categoriesCount}</h3>
          </div>
        </div>
      </div>

      {/* 3. FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, or tag..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Articles' },
            { id: 'published', label: 'Published' },
            { id: 'draft', label: 'Drafts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ARTICLES TABLE & CARDS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading articles catalog...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Articles Found</h4>
            <p className="text-xs text-slate-400">Try refining your search term or publish a new article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Author & Read Time</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPosts.map((post) => (
                  <tr key={post._id || post.slug} className="hover:bg-slate-50/70 transition-colors">
                    {/* Article Cover & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5 max-w-sm">
                        <img
                          src={post.coverImageUrl || '/shoes cleaning.jpg.jpeg'}
                          alt={post.title}
                          className="w-14 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 hover:text-red-600">
                            {post.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            /blog/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 font-bold text-[11px] rounded-lg border border-red-100">
                        {post.category || 'Shoe Care'}
                      </span>
                    </td>

                    {/* Author & Read Time */}
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800 block">{post.authorName || 'Kick Experts'}</span>
                        <span className="text-[11px] text-slate-400">{post.readTime || '4 min'}</span>
                      </div>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors shadow-xs ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status === 'published' ? '● Live Published' : '○ Draft'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Draft'}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Preview on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id, post.title)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. ARTICLE CREATE & EDIT MODAL DRAWER */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      {editingPost ? 'Edit Blog Article' : 'Publish New Care Guide'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Fill out the article details and markdown content below.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSavePost} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Title & Slug Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. 5 Pro Secrets for Spotless Leather Shoes"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. spotless-leather-shoes-secrets"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Category, Author, Read Time, Status Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="e.g. Kick Care Experts"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g. 5 min read"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Publish Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Cover Image URL & Quick Preset Picker */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Cover Image URL</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formData.coverImageUrl}
                      onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                      placeholder="/shoes cleaning.jpg.jpeg or https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {formData.coverImageUrl && (
                      <img
                        src={formData.coverImageUrl}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                    )}
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Presets:</span>
                    {PRESET_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => setFormData({ ...formData, coverImageUrl: img.url })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          formData.coverImageUrl === img.url
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Short Excerpt (Shows on card previews & social sharing)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence summary of what readers will learn..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Full Article Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Full Article Content * (Markdown Supported)</label>
                    <span className="text-[11px] text-slate-400">Use ## for Headings, - for bullets, 1. for steps</span>
                  </div>
                  <textarea
                    rows={10}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article paragraphs here. Use ## for Section Titles, ### for Subtitles..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Tags & SEO Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Sneakers, White Shoes, Drain Cleaner"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="Google Search Title"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{editingPost ? 'Update Article' : 'Publish Article'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
