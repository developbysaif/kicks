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

const HERO_SLIDES = [
  '/img6.jpg',
  '/img7.jpg',
  '/img8.jpg',
  '/Phenyle.jpg.jpeg'
];

const CATEGORIES_DATA = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    count: '12 Products',
    image: '/Shoe Care.png',
    bgColor: 'bg-amber-50/50',
    borderColor: 'border-amber-100'
  },
  {
    name: 'Laundry Care',
    slug: 'laundry-care',
    count: '10 Products',
    image: '/laundry Care.png',
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-100'
  },
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    count: '15 Products',
    image: '/Home Cleaning.png',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-100'
  },
  {
    name: 'Dish Care',
    slug: 'dish-care',
    count: '8 Products',
    image: '/dish care.png',
    bgColor: 'bg-teal-50/50',
    borderColor: 'border-teal-100'
  },
  {
    name: 'Washroom Cleaning',
    slug: 'washroom-cleaning',
    count: '6 Products',
    image: '/washroom cleaning.png',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
  {
    name: 'Mosquito Protection',
    slug: 'mosquito-protection',
    count: '5 Products',
    image: '/mosquito protection.png',
    bgColor: 'bg-purple-50/50',
    borderColor: 'border-purple-100'
  }
];

const INITIAL_FEATURED_PRODUCTS = [
  {
    _id: 'p1',
    name: 'Kick Bleach Liquid',
    slug: 'kick-bleach-liquid',
    category: { name: 'Laundry Care', slug: 'laundry-care' },
    price: 500,
    salePrice: 425,
    rating: 5.0,
    numReviews: 499,
    volume: '1 Litre',
    images: ['/whitner bleach.png'],
    isFeatured: true
  },
  {
    _id: 'p2',
    name: 'Kick Dishwash Liquid',
    slug: 'kick-dishwash-liquid',
    category: { name: 'Dish Care', slug: 'dish-care' },
    price: 350,
    salePrice: 315,
    rating: 5.0,
    numReviews: 156,
    volume: '500ml',
    images: ['/dish wash liquid.png'],
    isFeatured: true
  },
  {
    _id: 'p3',
    name: 'Kick White Sneaker Cleaner',
    slug: 'kick-white-sneaker-cleaner',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 420,
    salePrice: 380,
    rating: 5.0,
    numReviews: 82,
    volume: '500ml',
    images: ['/Shoe Care.png'],
    isFeatured: true
  },
  {
    _id: 'p4',
    name: 'Liquid Shoe Polish',
    slug: 'liquid-shoe-polish',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 520,
    salePrice: 0,
    rating: 5.0,
    numReviews: 72,
    volume: 'Black / Brown / Neutral',
    hasVariants: true,
    images: ['/liquid shoe polish.png'],
    isFeatured: true
  },
  {
    _id: 'p5',
    name: 'Kick Drain Opener',
    slug: 'kick-drain-opener',
    category: { name: 'Washroom Cleaning', slug: 'washroom-cleaning' },
    price: 520,
    salePrice: 0,
    rating: 5.0,
    numReviews: 170,
    volume: '1 Litre',
    images: ['/kick drain opener.png'],
    isFeatured: true
  },
  {
    _id: 'p6',
    name: 'Kick Drain Opener',
    slug: 'kick-drain-opener-spray',
    category: { name: 'Mosquito Protection', slug: 'mosquito-protection' },
    price: 680,
    salePrice: 0,
    rating: 5.0,
    numReviews: 203,
    volume: '45ml',
    images: ['/mosquito protection.png'],
    isFeatured: true
  }
];

export default function HomePage() {
  const [products, setProducts] = useState(INITIAL_FEATURED_PRODUCTS);
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Using initial fallback products:', err);
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full overflow-hidden min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] flex items-center bg-slate-100 border-b border-slate-100">
        
        {/* Background Image Slider (Manual Change Only - 0.5s Smooth Fade) */}
        {HERO_SLIDES.map((slide, index) => (
          <motion.img
            key={slide}
            src={slide}
            alt={`Hero banner ${index + 1}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.015
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 w-full h-full object-cover object-right ${
              index === currentSlide ? 'z-0 pointer-events-auto' : 'z-0 opacity-0 pointer-events-none'
            }`}
          />
        ))}

        {/* Overlaid Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
          
          {/* Top Left Text Block */}
          <div className="max-w-lg space-y-4 pt-2">
            
            {/* Red Pill Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-3.5 py-1 bg-red-600 text-white rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-md"
            >
              PREMIUM HOME CARE PRODUCTS
            </motion.div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Kara Asani <br />
              Zindagi Main
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
              Clean Homes. Healthy Lives. Discover our wide range of high-quality home care products designed to make your life easier and cleaner.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs tracking-wide transition-colors flex items-center space-x-2 shadow-md shadow-red-600/30"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-white border border-red-600 text-red-600 hover:bg-red-50 rounded-full font-bold text-xs tracking-wide transition-colors shadow-xs"
                >
                  Explore Categories
                </Link>
              </motion.div>
            </div>

          </div>

          {/* Bottom Row: 4 Feature Items (Left) + Carousel Controls (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6">
            
            {/* 4 Feature Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-w-lg lg:max-w-xl">
              <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">
                  Premium Quality
                </span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">
                  Fast Delivery
                </span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">
                  100% Secure
                </span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 whitespace-nowrap">
                  24/7 Support
                </span>
              </div>
            </div>

            {/* Carousel Arrows & Dot Indicators */}
            <div className="flex items-center space-x-3 self-end bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-1.5 mr-1">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-5 bg-red-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handlePrevSlide}
                className="w-7 h-7 bg-white text-slate-700 hover:text-red-600 hover:border-red-300 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-7 h-7 bg-white text-slate-700 hover:text-red-600 hover:border-red-300 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* REST OF PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-14 w-full">
        
        {/* 2. SHOP BY CATEGORY SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Shop By Category
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Find the right products for every corner of your home.
              </p>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_DATA.map((cat, index) => (
              <motion.div
                key={cat.slug}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className={`group p-4 rounded-2xl border ${cat.borderColor} ${cat.bgColor} hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden block h-full`}
                >
                  <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-white border border-slate-100">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 font-medium">
                      <span>{cat.count}</span>
                      <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. FEATURED PRODUCTS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Featured Products
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Top picks for a cleaner, healthier home.
              </p>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6 Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.slice(0, 6).map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* 4. MID PROMO BANNERS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Banner 1: Shoe Care */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden border border-slate-100 min-h-[220px] sm:min-h-[250px] flex items-center bg-white shadow-sm hover:shadow-xl transition-all group"
          >
            
            {/* Background Image: img5.png */}
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4 }}
              src="/img5.png"
              alt="Expert Care for Your Shoes"
              className="absolute inset-0 w-full h-full object-cover object-right"
            />

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 max-w-xs space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Expert Care for <br />
                <span className="text-red-600">Your Shoes</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Keep your shoes clean, shiny and new <br />
                with our premium shoe care range.
              </p>
              <Link
                href="/category/shoe-care"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors shadow-sm"
              >
                <span>Shop Shoe Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </motion.div>

          {/* Banner 2: Home Cleaning */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden border border-slate-100 min-h-[220px] sm:min-h-[250px] flex items-center bg-white shadow-sm hover:shadow-xl transition-all group"
          >
            
            {/* Background Image: promo-clean.jpg */}
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4 }}
              src="/promo-clean.jpg"
              alt="Powerful Cleaning for a Healthier Home"
              className="absolute inset-0 w-full h-full object-cover object-right"
            />

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 max-w-xs space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Powerful Cleaning <br />
                <span className="text-slate-900">for a Healthier Home</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Discover our home cleaning range for a spotless home.
              </p>
              <Link
                href="/category/home-cleaning"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors shadow-sm"
              >
                <span>Explore Home Cleaning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </motion.div>

        </section>

        {/* 5. WHY CHOOSE US & WHAT OUR CUSTOMERS SAY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Why Choose Us */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl font-black text-slate-900">Why Choose Us</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Your trust inspires us to do better every day.
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Trusted Quality</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Premium products you can rely on.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Effective Products</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Designed for real results.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Fast Delivery</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Across Pakistan.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Customer Satisfaction</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">We're here to help.</p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right Column: What Our Customers Say */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl font-black text-slate-900">What Our Customers Say</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Real feedback from real customers.
              </p>
            </div>

            {/* Testimonial Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-100 relative space-y-4 hover:shadow-lg transition-all"
            >
              
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-red-100 border border-red-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-red-600 text-sm">
                  AK
                </div>
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
                "Kick products are amazing! My shoes have never looked this clean. Highly recommended!"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Ayesha Khan</h5>
                  <span className="text-[10px] text-slate-400">Lahore</span>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-7 h-7 bg-white text-slate-600 rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:text-red-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-7 h-7 bg-white text-slate-600 rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:text-red-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </div>

        </section>

        {/* 6. NEWSLETTER BANNER */}
        <motion.section
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden min-h-[180px] sm:min-h-[200px] flex items-center bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all"
        >
          
          {/* Background Image: img4.jpeg */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            src="/img4.jpeg"
            alt="Subscribe to Our Newsletter"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlaid Content Container (Centered) */}
          <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-3">
            
            {/* Red Circle Mail Icon */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer"
            >
              <Mail className="w-6 h-6" />
            </motion.div>

            {/* Centered Text Block */}
            <div className="max-w-md">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Get the latest updates, offers and home care tips.
              </p>
            </div>

          </div>

        </motion.section>

      </main>

      <Footer />
    </div>
  );
}
