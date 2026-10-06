'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogDetailClient({ post, relatedPosts = [] }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">Article Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The care guide or article you are looking for may have been moved or unpublished.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#D0161D] text-white text-xs font-bold rounded-xl shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Guides</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-[#D0161D] selection:text-white">
      <Header />

      {/* Structured Breadcrumbs & Back Link */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs font-semibold">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-[#D0161D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center space-x-2 text-slate-400">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-slate-700">Blog</Link>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-[200px]">{post.category || 'Article'}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1">
        {/* SECTION 1 (WHITE) -> Article Content & Sidebar */}
        <section className="bg-white py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Article Header */}
            <header className="space-y-5 text-center max-w-3xl mx-auto">
              {/* Category Chip */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#D0161D] border border-red-100 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{post.category || 'Care Guide'}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Meta Row */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#D0161D] text-white font-black text-xs flex items-center justify-center shadow-xs">
                    K
                  </div>
                  <span className="text-slate-900 font-bold">{post.authorName || 'Kick Care Experts'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Recently Published'}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.readTime || '4 min read'}</span>
                </div>
              </div>
            </header>

            {/* Hero Cover Image */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900">
              <img
                src={post.coverImageUrl || '/shoes cleaning.jpg.jpeg'}
                alt={post.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Main Content */}
              <article className="lg:col-span-8 bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
                <div className="prose prose-slate max-w-none space-y-5">
                  {post.content ? post.content.split('\n\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;

                    // Heading 2 (##)
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-4 border-b border-slate-200 pb-2">
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }

                    // Heading 3 (###)
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-base sm:text-lg font-bold text-[#D0161D] tracking-tight pt-2">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }

                    // Bullet Lists (-)
                    if (trimmed.startsWith('- ')) {
                      const items = trimmed.split('\n').map((i) => i.replace(/^- /, ''));
                      return (
                        <ul key={idx} className="space-y-2 list-disc list-inside bg-white p-5 rounded-2xl border border-slate-200 font-medium">
                          {items.map((item, iIdx) => (
                            <li key={iIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    // Numbered Steps
                    if (/^\d+\./.test(trimmed)) {
                      const steps = trimmed.split('\n');
                      return (
                        <div key={idx} className="space-y-3 bg-red-50/60 p-5 sm:p-6 rounded-2xl border border-red-100">
                          {steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex items-start space-x-3 text-xs sm:text-sm">
                              <span className="w-5 h-5 rounded-full bg-[#D0161D] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <p className="flex-1 font-medium text-slate-800 leading-relaxed">
                                {st.replace(/^\d+\.\s*/, '')}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // Standard paragraph
                    return (
                      <p key={idx} className="font-medium text-slate-600 leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  }) : null}
                </div>

                {/* Tags row */}
                {post.tags && post.tags.length > 0 && (
                  <div className="pt-6 border-t border-slate-200 flex items-center flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-400">Tagged with:</span>
                    {post.tags.map((tg) => (
                      <span
                        key={tg}
                        className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Article Bar */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Found this helpful? Share with friends:</span>
                  <button
                    onClick={handleShare}
                    aria-label="Share article"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-red-50 text-slate-700 hover:text-[#D0161D] rounded-xl text-xs font-bold border border-slate-200 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
                  </button>
                </div>
              </article>

              {/* Right Sidebar */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#D0161D]">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Recommended by Experts</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    Achieve Professional Results with Kick Care Formulations
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Our tested formulas are formulated specifically for Pakistani fabrics, shoes, and washrooms. 100% genuine guaranteed with fast nationwide dispatch.
                  </p>
                  <Link
                    href="/shop"
                    className="w-full py-3 px-4 bg-[#D0161D] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Shop Kick Essentials</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold">Tested & Verified</h4>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    All care protocols published in the Kick Journal are verified by chemical specialists and cobbler artisans for maximum safety and efficacy.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* SECTION 2 (RED) -> Related Articles Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="bg-[#D0161D] text-white py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                    Keep Reading
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                    Related Guides &amp; Tips
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-full flex items-center space-x-1.5 shadow-sm transition"
                >
                  <span>View All Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost._id || rPost.slug}
                    href={`/blog/${rPost.slug}`}
                    className="group bg-white text-slate-900 rounded-3xl border border-white/20 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img
                        src={rPost.coverImageUrl || '/shoes cleaning.jpg.jpeg'}
                        alt={rPost.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-[#D0161D] uppercase tracking-wider">
                        {rPost.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#D0161D] transition-colors line-clamp-2 leading-snug">
                        {rPost.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {rPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
