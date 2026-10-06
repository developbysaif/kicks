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

const ALL_CATALOG_PRODUCTS = [
  {
    _id: 'p1',
    name: 'Kick Bleach Liquid Ultra Clean',
    slug: 'kick-bleach-liquid',
    category: { name: 'Laundry Care', slug: 'laundry-care' },
    price: 500,
    salePrice: 425,
    rating: 5.0,
    numReviews: 499,
    volume: '1 Litre',
    images: ['/whitner bleach.png', '/laundry Care.png'],
    isFeatured: true
  },
  {
    _id: 'p2',
    name: 'Kick Whitner Bleach Liquid 500ml',
    slug: 'kick-whitner-bleach-500ml',
    category: { name: 'Laundry Care', slug: 'laundry-care' },
    price: 250,
    salePrice: 220,
    rating: 4.9,
    numReviews: 140,
    volume: '500ml',
    images: ['/laundry Care.png', '/whitner bleach.png'],
    isFeatured: true
  },
  {
    _id: 'p3',
    name: 'Kick Dishwash Liquid',
    slug: 'kick-dishwash-liquid',
    category: { name: 'Dish Care', slug: 'dish-care' },
    price: 350,
    salePrice: 315,
    rating: 5.0,
    numReviews: 156,
    volume: '500ml',
    images: ['/dish wash liquid.png', '/dish care.png'],
    isFeatured: true
  },
  {
    _id: 'p4',
    name: 'Kick Dishwash Liquid One-Kick Drop 1 Litre',
    slug: 'kick-dishwash-liquid-1l',
    category: { name: 'Dish Care', slug: 'dish-care' },
    price: 490,
    salePrice: 430,
    rating: 5.0,
    numReviews: 320,
    volume: '1 Litre',
    images: ['/dish care.png', '/dish wash liquid.png'],
    isFeatured: false
  },
  {
    _id: 'p5',
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
    _id: 'p6',
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
    _id: 'p7',
    name: 'Kick Active Foam Sneaker Cleanser',
    slug: 'kick-active-foam-sneaker-cleanser',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 490,
    salePrice: 440,
    rating: 4.9,
    numReviews: 114,
    volume: '200ml Active Pump',
    images: ['/Shoe Care.png'],
    isFeatured: true
  },
  {
    _id: 'p8',
    name: 'Kick Hydrophobic Shield Rain & Stain Protector',
    slug: 'kick-hydrophobic-shield-protector',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 650,
    salePrice: 590,
    rating: 4.9,
    numReviews: 93,
    volume: '250ml Aerosol',
    images: ['/Shoe Care.png'],
    isFeatured: true
  },
  {
    _id: 'p9',
    name: 'Kick Ergonomic 100% Horsehair Shoe Brush',
    slug: 'kick-ergonomic-horsehair-shoe-brush',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 320,
    salePrice: 280,
    rating: 4.8,
    numReviews: 64,
    volume: 'Hardwood Handle',
    images: ['/Shoe Care.png'],
    isFeatured: false
  },
  {
    _id: 'p10',
    name: 'Kick Fresh Shoe & Sneaker Deodorizer Spray',
    slug: 'kick-fresh-shoe-deodorizer-spray',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 380,
    salePrice: 340,
    rating: 4.9,
    numReviews: 78,
    volume: '150ml Mist Spray',
    images: ['/Shoe Care.png'],
    isFeatured: false
  },
  {
    _id: 'p11',
    name: 'Kick Super Wax Shoe Polish Tin 50g',
    slug: 'kick-super-wax-shoe-polish-tin',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 240,
    salePrice: 220,
    rating: 4.9,
    numReviews: 152,
    volume: '50g Metal Tin',
    images: ['/Shoe Care.png'],
    isFeatured: false
  },
  {
    _id: 'p12',
    name: 'Kick Instant Shoe Shiner Sponge',
    slug: 'kick-instant-shoe-shiner-sponge',
    category: { name: 'Shoe Care', slug: 'shoe-care' },
    price: 220,
    salePrice: 200,
    rating: 4.9,
    numReviews: 96,
    volume: 'Travel Sponge',
    images: ['/Shoe Care.png'],
    isFeatured: false
  },
  {
    _id: 'p13',
    name: 'Kick Perfumed White Phenyle 2.75L',
    slug: 'kick-perfumed-white-phenyle',
    category: { name: 'Home Cleaning', slug: 'home-cleaning' },
    price: 650,
    salePrice: 580,
    rating: 5.0,
    numReviews: 210,
    volume: '2.75 Litre Bottle',
    images: ['/Home Cleaning.png', '/Phenyle.jpg.jpeg'],
    isFeatured: true
  },
  {
    _id: 'p14',
    name: 'Kick Surface Cleaner Floor Mop Liquid',
    slug: 'kick-surface-cleaner-liquid',
    category: { name: 'Home Cleaning', slug: 'home-cleaning' },
    price: 380,
    salePrice: 340,
    rating: 4.9,
    numReviews: 95,
    volume: '1 Litre',
    images: ['/Home Cleaning.png'],
    isFeatured: true
  },
  {
    _id: 'p15',
    name: 'Kick Drain Opener Fast Acting 1 Litre',
    slug: 'kick-drain-opener',
    category: { name: 'Washroom Cleaning', slug: 'washroom-cleaning' },
    price: 520,
    salePrice: 0,
    rating: 5.0,
    numReviews: 170,
    volume: '1 Litre',
    images: ['/kick drain opener.png', '/washroom cleaning.png'],
    isFeatured: true
  },
  {
    _id: 'p16',
    name: 'Kick 10X Bathroom & Toilet Power Cleaner',
    slug: 'kick-toilet-bathroom-cleaner',
    category: { name: 'Washroom Cleaning', slug: 'washroom-cleaning' },
    price: 450,
    salePrice: 390,
    rating: 4.9,
    numReviews: 112,
    volume: '500ml Angled Nozzle',
    images: ['/washroom cleaning.png', '/kick drain opener.png'],
    isFeatured: true
  },
  {
    _id: 'p17',
    name: 'Kick Mosquit Advance Liquid Machine + Refill',
    slug: 'kick-mosquito-advance-machine-refill',
    category: { name: 'Mosquito Protection', slug: 'mosquito-protection' },
    price: 680,
    salePrice: 0,
    rating: 5.0,
    numReviews: 203,
    volume: '45ml (60 Nights)',
    images: ['/mosquito protection.png'],
    isFeatured: true
  },
  {
    _id: 'p18',
    name: 'Kick Mosquit Repellent Aerosol Spray 300ml',
    slug: 'kick-mosquito-spray-300ml',
    category: { name: 'Mosquito Protection', slug: 'mosquito-protection' },
    price: 550,
    salePrice: 480,
    rating: 4.9,
    numReviews: 88,
    volume: '300ml Can',
    images: ['/mosquito protection.png'],
    isFeatured: true
  }
];

const FILTER_TABS = [
  { label: 'All Products', slug: 'all' },
  { label: 'Shoe Care', slug: 'shoe-care' },
  { label: 'Laundry Care', slug: 'laundry-care' },
  { label: 'Home Cleaning', slug: 'home-cleaning' },
  { label: 'Dish Care', slug: 'dish-care' },
  { label: 'Washroom Cleaning', slug: 'washroom-cleaning' },
  { label: 'Mosquito Protection', slug: 'mosquito-protection' }
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
  const [products, setProducts] = useState(ALL_CATALOG_PRODUCTS);
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Using fallback catalog products:', err);
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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((prod) => {
        const catSlug = prod.category?.slug || '';
        const catName = (prod.category?.name || '').toLowerCase();
        if (selectedCategory === 'washroom-cleaning') {
          return catSlug === 'washroom-cleaning' || catSlug === 'drain-care' || catName.includes('washroom') || catName.includes('drain');
        }
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

      {/* REST OF PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-14 w-full">
        
        {/* 2. SHOP BY CATEGORY SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Shop By Category
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
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
                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500 font-medium">
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
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Top picks for a cleaner, healthier home and pristine footwear.
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
        </section>

        {/* 4. ALL KICK PRODUCTS SECTION */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span>All Kick Products</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100">
                    {filteredProducts.length} Items
                  </span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Complete range of authentic shoe care and home hygiene formulations.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_TABS.map((tab) => {
                const isActive = selectedCategory === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    onClick={() => setSelectedCategory(tab.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of All Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id || prod.slug}
                product={prod}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>



        {/* 5. WHY CHOOSE US & WHAT OUR CUSTOMERS SAY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left Column: Why Choose Us */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
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
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">Trusted Quality</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Premium products you can rely on.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">Effective Products</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Designed for real results.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">Fast Delivery</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Across Pakistan.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">Customer Satisfaction</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">We're here to help.</p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right Column: What Our Customers Say */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
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
              className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-100 relative space-y-5 hover:shadow-lg transition-all"
            >
              
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 overflow-hidden shrink-0 flex items-center justify-center font-extrabold text-red-600 text-base">
                  {TESTIMONIALS[currentTestimonial].initials}
                </div>
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 italic font-medium leading-relaxed min-h-[4rem]">
                {TESTIMONIALS[currentTestimonial].quote}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <div>
                  <h5 className="text-sm sm:text-base font-bold text-slate-900">{TESTIMONIALS[currentTestimonial].name}</h5>
                  <span className="text-xs font-semibold text-slate-400">{TESTIMONIALS[currentTestimonial].location}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="w-9 h-9 bg-white text-slate-700 rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:text-red-600 hover:border-red-300 transition-colors"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                    className="w-9 h-9 bg-white text-slate-700 rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:text-red-600 hover:border-red-300 transition-colors"
                    aria-label="Next Testimonial"
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
