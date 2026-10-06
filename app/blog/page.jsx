'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Tag,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { INITIAL_BLOG_POSTS } from '@/lib/blogData';

const CATEGORY_TABS = [
  'All Articles',
  'Shoe Care',
  'Washroom Cleaning',
  'Laundry Care',
  'Home Hygiene'
];

export default function BlogListingPage() {
  const [posts, setPosts] = useState(INITIAL_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blogs');
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.warn('Using fallback blog articles:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === 'All Articles' ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.category?.toLowerCase().includes(q) ||
        post.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Featured Hero Article (First post)
  const featuredPost = posts[0] || INITIAL_BLOG_POSTS[0];
  const displayPosts = selectedCategory === 'All Articles' && !searchQuery
    ? filteredPosts.slice(1)
    : filteredPosts;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-red-600 selection:text-white">
      <Header />

      {/* 1. HERO HEADER WITH BACKGROUND IMAGE */}
      <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[360px] sm:min-h-[440px] flex items-center">
        
        {/* Background Image with Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/about-hero-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />

        {/* Floating Brand Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-3xl space-y-5">
            
            {/* Top Red Badge Chip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D0161D] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kick® Care & Hygiene Insights</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            >
              The Modern Home & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
                Shoe Care Journal
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl"
            >
              Master sneaker restoration, hospital-grade home disinfection, fabric whitening, and professional drain unblocking with tested insights from Pakistan's premier hygiene brand.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="pt-2 max-w-xl"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, care tips, or ingredients..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/15 transition-all shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 w-full flex-1">
        
        {/* Category Tabs Filter */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
            {CATEGORY_TABS.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>

        {/* 3. FEATURED STORY (When viewing all articles and no search query active) */}
        {selectedCategory === 'All Articles' && !searchQuery && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Left Cover Image */}
            <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-slate-900">
              <img
                src={featuredPost.coverImageUrl || '/shoes cleaning.jpg.jpeg'}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase shadow-md">
                  Featured Guide
                </span>
              </div>
            </div>

            {/* Right Meta & Text */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500">
                  <span className="text-red-600 font-bold uppercase tracking-wider">{featuredPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredPost.readTime || '5 min read'}
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tight leading-snug">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-black text-xs">
                    K
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{featuredPost.authorName || 'Kick Experts'}</h4>
                    <span className="text-[11px] text-slate-400">Footwear Care Lab</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. ARTICLES GRID */}
        {displayPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Articles Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any articles matching your search criteria. Try selecting another category or clear the search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Articles');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayPosts.map((post) => (
              <motion.article
                key={post._id || post.slug}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImageUrl || '/shoes cleaning.jpg.jpeg'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-red-600 font-extrabold text-[11px] rounded-lg shadow-sm border border-slate-100 uppercase tracking-wider">
                        {post.category || 'Care Guide'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Read Time & Date */}
                    <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently Published'}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime || '4 min read'}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-[11px] font-bold text-slate-500">
                    {post.authorName || 'Kick Experts'}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors"
                  >
                    <span>Read Guide</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* 5. CARE NEWSLETTER CALLOUT */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-red-400">KICK VIP JOURNAL</span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Get Weekly Shoe Care Hacks & Exclusive Deals Delivered to Your Inbox
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Join 25,000+ Pakistani homeowners and sneaker enthusiasts who receive our vetted formulas, stain removal guides, and promo coupon drops.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors shadow-lg shadow-red-600/30"
              >
                <span>Explore Kick Product Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
