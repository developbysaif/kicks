'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  ChevronLeft,
  ChevronRight,
  Mail,
  Headphones,
  Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import PageSection from '@/components/PageSection';

const HERO_SLIDES = [
  {
    image: '/img6.jpg',
    badge: 'PREMIUM HOME CARE PRODUCTS',
    heading: <>Karo Apna Ghar<br />Chamakta Saaf</>,
    subtitle: 'Pakistan\'s most trusted home care brand — from shoes to kitchen, bathroom to floors, KICK has every corner covered.',
    cta: 'Shop Now',
    ctaLink: '/shop'
  },
  {
    image: '/img7.jpg',
    badge: 'SHOE CARE SPECIALISTS',
    heading: <>Joote Ho Jain<br /><span className="text-[#D0161D]">Bilkul Naye</span></>,
    subtitle: 'Kick shoe cleaners, polishes and protectors restore shine and extend the life of every pair you own.',
    cta: 'Shop Shoe Care',
    ctaLink: '/shop/shoe-care'
  },
  {
    image: '/Washroom CLeaning.jpg.jpeg',
    badge: 'WASHROOM CLEANING',
    heading: <>Washroom Ho<br /><span className="text-[#D0161D]">100% Germ Free</span></>,
    subtitle: 'Powerful drain openers, toilet gels and bathroom cleaners that tackle the toughest blockages and limescale fast.',
    cta: 'Shop Washroom',
    ctaLink: '/category/washroom-cleaning'
  },
  {
    image: '/img8.jpg',
    badge: 'LAUNDRY CARE',
    heading: <>Kapray Ho Jain<br /><span className="text-[#D0161D]">Dazzling White</span></>,
    subtitle: 'Kick Bleach Liquid and Whitener keep your fabrics brilliantly bright, fresh and hygienic wash after wash.',
    cta: 'Shop Laundry',
    ctaLink: '/category/laundry-care'
  },
  {
    image: '/Phenyle.jpg.jpeg',
    badge: 'HOME CLEANING RANGE',
    heading: <>Ghar Ki Safai<br /><span className="text-[#D0161D]">Poori Tarah Perfect</span></>,
    subtitle: 'Kick Perfumed White Phenyle and floor cleaners leave every surface spotless with a long-lasting fresh fragrance.',
    cta: 'Shop Home Cleaning',
    ctaLink: '/category/home-cleaning'
  }
];

const TESTIMONIALS = [
  {
    initials: 'AK',
    name: 'Ayesha Khan',
    location: 'Lahore',
    quote: '"Kick products are amazing! My shoes have never looked this clean. Highly recommended!"'
  },
  {
    initials: 'BA',
    name: 'Bilal Ahmed',
    location: 'Karachi',
    quote: '"The drain opener and bathroom cleaner worked like magic in minutes. 100% genuine products with fast delivery."'
  },
  {
    initials: 'UT',
    name: 'Usman Tariq',
    location: 'Islamabad',
    quote: '"Kick Bleach Liquid and sneaker cleaner are top notch quality. Much better than imported brands and very economical."'
  }
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoadingProducts(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/products').catch(() => null),
        axios.get('/api/categories').catch(() => null)
      ]);

      if (prodRes?.data?.success && Array.isArray(prodRes.data.products)) {
        setProducts(prodRes.data.products);
      }

      if (catRes?.data?.success && Array.isArray(catRes.data.categories)) {
        setCategories(catRes.data.categories);
      }
    } catch (err) {
      console.error('Error fetching homepage live catalog:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await axios.post('/api/newsletter', { email: newsletterEmail });
      setNewsletterStatus('Thank you for subscribing!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus('Subscribed successfully!');
      setNewsletterEmail('');
    }
  };

  const featuredProducts = products.filter((p) => p.isFeatured).length > 0
    ? products.filter((p) => p.isFeatured).slice(0, 4)
    : products.slice(0, 4);

  const filterTabs = [
    { label: 'All Products', slug: 'all' },
    ...categories.map((c) => ({ label: c.name, slug: c.slug }))
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((prod) => {
        const catSlug = prod.categoryId?.slug || prod.category?.slug || (typeof prod.category === 'string' ? prod.category : '');
        const catName = (prod.categoryId?.name || prod.category?.name || '').toLowerCase();
        return catSlug === selectedCategory || catName.replace(/\s+/g, '-').includes(selectedCategory);
      });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full overflow-hidden min-h-[340px] sm:min-h-[460px] lg:min-h-[520px] flex items-center bg-slate-100 border-b border-slate-100">

        {/* Background Image Slider */}
        {HERO_SLIDES.map((slide, index) => (
          <motion.img
            key={slide.image}
            src={slide.image}
            alt={`Hero banner ${index + 1}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.015
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
          />
        ))}

        {/* Overlaid Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 flex flex-col justify-between min-h-[340px] sm:min-h-[460px] lg:min-h-[520px]">

          {/* Dynamic Per-Slide Text Block */}
          <div className="max-w-xl space-y-4 pt-2 flex-1 flex flex-col justify-center">

            {/* Animated Badge */}
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block px-3.5 py-1 bg-[#D0161D] text-white rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-md w-fit"
            >
              {HERO_SLIDES[currentSlide].badge}
            </motion.div>

            {/* Animated Heading */}
            <motion.h1
              key={`heading-${currentSlide}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]"
            >
              {HERO_SLIDES[currentSlide].heading}
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md"
            >
              {HERO_SLIDES[currentSlide].subtitle}
            </motion.p>

            {/* Animated CTA Buttons */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={HERO_SLIDES[currentSlide].ctaLink}
                  className="px-6 py-2.5 bg-[#D0161D] hover:bg-red-800 text-white rounded-full font-bold text-xs tracking-wide transition-colors flex items-center space-x-2 shadow-md shadow-red-600/30"
                >
                  <span>{HERO_SLIDES[currentSlide].cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-white border border-[#D0161D] text-[#D0161D] hover:bg-red-50 rounded-full font-bold text-xs tracking-wide transition-colors shadow-xs"
                >
                  Explore Categories
                </Link>
              </motion.div>
            </motion.div>

          </div>

          {/* Bottom Row: 4 Feature Items (Left) + Carousel Controls (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 sm:pt-6">

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-w-lg lg:max-w-xl">
              <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">Premium Quality</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">Fast Delivery</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">100% Secure</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">24/7 Support</span>
              </div>
            </div>

            {/* Carousel Arrows & Dot Indicators */}
            <div className="flex items-center space-x-3 self-end bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-1.5 mr-1">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-5 bg-[#D0161D]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handlePrevSlide}
                className="w-7 h-7 bg-white text-slate-700 hover:text-[#D0161D] hover:border-red-300 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-7 h-7 bg-white text-slate-700 hover:text-[#D0161D] hover:border-red-300 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 2. SHOP BY CATEGORY SECTION — RED */}
      <PageSection variant="red" className="border-t border-b border-red-700/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-white rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Shop By Category
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium">
              Find the right products for every corner of your home.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-black text-black bg-white hover:bg-black hover:text-white px-5 py-2.5 rounded-full flex items-center space-x-1.5 group transition-all shadow-md w-fit"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards — Clean White Cards on Red */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={cat.slug === 'shoe-care' ? '/shop/shoe-care' : `/category/${cat.slug}`}
                className="group p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-white/40 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden block h-full"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-50 border border-slate-100">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={cat.image || '/Shoe Care.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-black group-hover:text-[#D0161D] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-black/70 font-bold">
                    <span>{cat.productCount ? `${cat.productCount} Products` : 'Explore'}</span>
                    <span className="text-black font-black group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </PageSection>

      {/* 3. FEATURED PRODUCTS SECTION — WHITE */}
      <PageSection variant="white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-[#D0161D] rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Top picks for a cleaner, healthier home and pristine footwear.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-[#D0161D] hover:text-red-800 flex items-center space-x-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Featured Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={`feat-${prod._id || prod.slug}`}
              product={prod}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </PageSection>

      {/* 4. ALL KICK PRODUCTS SECTION — RED */}
      <PageSection variant="red" className="border-t border-b border-red-700/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-white rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                All Kick Products
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium">
              Explore our full catalog of high-performance cleaning and care essentials.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-black text-black bg-white hover:bg-black hover:text-white px-5 py-2.5 rounded-full flex items-center space-x-1.5 group transition-all shadow-md w-fit"
          >
            <span>Open Full Shop</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills on Red */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setSelectedCategory(tab.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-black font-black shadow-md'
                    : 'bg-white/15 hover:bg-white/25 text-white font-bold backdrop-blur-xs'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid of All Products — White Cards on Red */}
        {loadingProducts ? (
          <div className="text-center py-16 text-white font-bold text-sm">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-white/20 shadow-xl max-w-lg mx-auto">
            <p className="text-base font-bold text-slate-800">No products found in this category.</p>
            <p className="text-xs text-slate-500 mt-1">Please check back soon or browse our other categories.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-5 py-2.5 bg-[#D0161D] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-red-800 transition"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id || prod.slug}
                product={prod}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </PageSection>

      {/* 5. WHY CHOOSE US & WHAT OUR CUSTOMERS SAY — WHITE */}
      <PageSection variant="white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Why Choose Us */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-[#D0161D] rounded-full"></span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Why Choose Us</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-medium">
                Your trust inspires us to do better every day.
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl flex items-start space-x-4 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-[#D0161D]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">Trusted Quality</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">Premium products you can rely on.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl flex items-start space-x-4 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <Sparkles className="w-6 h-6 text-[#D0161D]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">Effective Products</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">Designed for real results.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl flex items-start space-x-4 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <Truck className="w-6 h-6 text-[#D0161D]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">Fast Delivery</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">Across Pakistan.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl flex items-start space-x-4 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D0161D] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <Headphones className="w-6 h-6 text-[#D0161D]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">Customer Satisfaction</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">We're here to help.</p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right Column: What Our Customers Say */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-[#D0161D] rounded-full"></span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">What Our Customers Say</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-medium">
                Real feedback from real customers.
              </p>
            </div>

            {/* Testimonial Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 relative space-y-5 shadow-sm hover:shadow-xl transition-all"
            >
              
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#D0161D] text-white overflow-hidden shrink-0 flex items-center justify-center font-black text-base shadow-sm">
                  {TESTIMONIALS[currentTestimonial].initials}
                </div>
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 italic font-medium leading-relaxed min-h-[4rem]">
                "{TESTIMONIALS[currentTestimonial].quote}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <h5 className="text-sm sm:text-base font-black text-slate-900">{TESTIMONIALS[currentTestimonial].name}</h5>
                  <span className="text-xs font-bold text-slate-500">{TESTIMONIALS[currentTestimonial].location}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="w-9 h-9 bg-slate-100 hover:bg-[#D0161D] hover:text-white text-slate-700 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                    className="w-9 h-9 bg-slate-100 hover:bg-[#D0161D] hover:text-white text-slate-700 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </PageSection>

      {/* 6. NEWSLETTER BANNER — RED */}
      <PageSection variant="red" className="relative overflow-hidden py-14 sm:py-20">
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
          
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white text-[#D0161D] flex items-center justify-center shrink-0 shadow-lg cursor-pointer"
          >
            <Mail className="w-7 h-7" />
          </motion.div>

          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-white/90 font-medium mt-1.5 max-w-md mx-auto">
              Get the latest updates, exclusive discounts, and home care tips directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <input
              type="email"
              required
              aria-label="Email address for newsletter"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full py-3.5 px-5 bg-white text-slate-900 rounded-full text-xs font-semibold placeholder:text-slate-400 focus:outline-none shadow-md"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-black hover:bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              Subscribe
            </button>
          </form>
          {newsletterStatus && (
            <p className="text-xs font-bold text-white bg-black/20 px-4 py-1.5 rounded-full mt-2">
              {newsletterStatus}
            </p>
          )}

        </div>
      </PageSection>

      <Footer />
    </div>
  );
}
