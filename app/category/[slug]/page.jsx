'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ChevronRight, Filter, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';

const CATEGORY_META = {
  'laundry-care': {
    name: 'Laundry Care',
    bannerImage: '/laundry Care.png',
    tagline: 'Brilliant Whites & Long-Lasting Fabric Freshness',
    description:
      'Explore high performance bleach liquid, blue whitening agents, and fabric conditioners specially engineered for Pakistani cottons and fabrics.',
    color: 'from-blue-900 to-indigo-950',
    fallbackProducts: [
      {
        _id: 'lc-1',
        name: 'Kick Bleach Liquid Ultra Clean 1 Litre',
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
        _id: 'lc-2',
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
      }
    ]
  },
  'home-cleaning': {
    name: 'Home Cleaning',
    bannerImage: '/Home Cleaning.png',
    tagline: 'Sparkling Surfaces & Fresh Lavender Aroma',
    description:
      'All-purpose surface cleaners, perfumed floor phenyle, and descaling bathroom power gels designed to eliminate 99.9% household germs.',
    color: 'from-emerald-900 to-teal-950',
    fallbackProducts: [
      {
        _id: 'hc-1',
        name: 'Kick Perfumed White Phenyle 2.75L',
        slug: 'kick-perfumed-white-phenyle',
        category: { name: 'Home Cleaning', slug: 'home-cleaning' },
        price: 650,
        salePrice: 580,
        rating: 5.0,
        numReviews: 210,
        volume: '2.75 Litre Bottle',
        images: ['/Home Cleaning.png', '/phenyle.png'],
        isFeatured: true
      },
      {
        _id: 'hc-2',
        name: 'Kick Surface Cleaner Floor Mop Liquid',
        slug: 'kick-surface-cleaner-liquid',
        category: { name: 'Home Cleaning', slug: 'home-cleaning' },
        price: 380,
        salePrice: 340,
        rating: 4.9,
        numReviews: 95,
        volume: '1 Litre',
        images: ['/phenyle.png', '/Home Cleaning.png'],
        isFeatured: true
      }
    ]
  },
  'dish-care': {
    name: 'Dish Care',
    bannerImage: '/dish care.png',
    tagline: 'Tough Grease Cutting with Citrus Power',
    description:
      'High-active foam dishwashing liquids enriched with lemon extract to lift baked-on oil and stubborn curry stains with a single drop.',
    color: 'from-amber-900 to-yellow-950',
    fallbackProducts: [
      {
        _id: 'dc-1',
        name: 'Kick Dishwash Liquid One-Kick Drop 1 Litre',
        slug: 'kick-dishwash-liquid-1l',
        category: { name: 'Dish Care', slug: 'dish-care' },
        price: 490,
        salePrice: 430,
        rating: 5.0,
        numReviews: 320,
        volume: '1 Litre Dispenser',
        images: ['/dish care.png', '/dish wash liquid.png'],
        isFeatured: true
      },
      {
        _id: 'dc-2',
        name: 'Kick Dishwash Liquid 500ml Lemon Fresh',
        slug: 'kick-dishwash-liquid',
        category: { name: 'Dish Care', slug: 'dish-care' },
        price: 350,
        salePrice: 315,
        rating: 5.0,
        numReviews: 156,
        volume: '500ml',
        images: ['/dish wash liquid.png', '/dish care.png'],
        isFeatured: true
      }
    ]
  },
  'washroom-cleaning': {
    name: 'Washroom Cleaning',
    bannerImage: '/washroom cleaning.png',
    tagline: 'Heavy Duty Clog Removal & Limescale Descaling',
    description:
      'Professional-grade drain openers, toilet gels, and bathroom cleaners that melt hair, soap scum, and grease in blocked sink and floor pipes.',
    color: 'from-slate-900 to-indigo-950',
    fallbackProducts: [
      {
        _id: 'wc-1',
        name: 'Kick Drain Opener Fast Acting 1 Litre',
        slug: 'kick-drain-opener',
        category: { name: 'Washroom Cleaning', slug: 'washroom-cleaning' },
        price: 520,
        salePrice: 0,
        rating: 5.0,
        numReviews: 170,
        volume: '1 Litre Bottle',
        images: ['/kick drain opener.png', '/washroom cleaning.png'],
        isFeatured: true
      },
      {
        _id: 'wc-2',
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
      }
    ]
  },
  'drain-care': {
    name: 'Drain Care',
    bannerImage: '/washroom cleaning.png',
    tagline: 'Heavy Duty Clog Removal & Limescale Descaling',
    description:
      'Professional-grade drain openers, toilet gels, and bathroom cleaners that melt hair, soap scum, and grease in blocked sink and floor pipes.',
    color: 'from-slate-900 to-indigo-950',
    fallbackProducts: [
      {
        _id: 'dc-1',
        name: 'Kick Drain Opener Fast Acting 1 Litre',
        slug: 'kick-drain-opener',
        category: { name: 'Drain Care', slug: 'drain-care' },
        price: 520,
        salePrice: 0,
        rating: 5.0,
        numReviews: 170,
        volume: '1 Litre Bottle',
        images: ['/kick drain opener.png', '/washroom cleaning.png'],
        isFeatured: true
      },
      {
        _id: 'dc-2',
        name: 'Kick 10X Bathroom & Toilet Power Cleaner',
        slug: 'kick-toilet-bathroom-cleaner',
        category: { name: 'Drain Care', slug: 'drain-care' },
        price: 450,
        salePrice: 390,
        rating: 4.9,
        numReviews: 112,
        volume: '500ml Angled Nozzle',
        images: ['/washroom cleaning.png', '/kick drain opener.png'],
        isFeatured: true
      }
    ]
  },
  'mosquito-protection': {
    name: 'Mosquito Protection',
    bannerImage: '/mosquito protection.png',
    tagline: 'Reliable Defense Against Mosquitoes & Dengue',
    description:
      'Electric liquid refills, mosquito coils, and crawling insect sprays providing 60 nights of continuous family protection.',
    color: 'from-purple-900 to-slate-950',
    fallbackProducts: [
      {
        _id: 'mp-1',
        name: 'Kick Mosquit Advance Liquid Machine + Refill',
        slug: 'kick-drain-opener-spray',
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
        _id: 'mp-2',
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
    ]
  }
};

export default function CategoryPage({ params }) {
  const { slug } = params;
  const currentMeta = CATEGORY_META[slug] || {
    name: slug.replace(/-/g, ' '),
    bannerImage: '/fav-icon-kick.png',
    tagline: 'Authentic Kick Home Care Products',
    description: `Browse premium home-care solutions formulated for ${slug.replace(/-/g, ' ')}.`,
    color: 'from-slate-900 to-emerald-950',
    fallbackProducts: []
  };

  const [products, setProducts] = useState(currentMeta.fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (slug === 'shoe-care') {
      window.location.replace('/shop/shoe-care');
      return;
    }
    fetchCategoryProducts();
  }, [slug]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?category=${slug}`);
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(currentMeta.fallbackProducts);
      }
    } catch (err) {
      setProducts(currentMeta.fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F6] text-[#1E293B] font-sans">
      <Header />

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/shop" className="hover:text-red-600 transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F3A5F] font-bold capitalize">{currentMeta.name}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* CATEGORY HERO BANNER WITH BRAND IMAGE */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${currentMeta.color} text-white shadow-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8`}>
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#F4B942]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kick® Official Category</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black capitalize tracking-tight">
              {currentMeta.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#F4B942]">
              {currentMeta.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {currentMeta.description}
            </p>
          </div>

          {/* Category Image Box */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shrink-0 flex items-center justify-center shadow-2xl">
            <img
              src={currentMeta.bannerImage}
              alt={currentMeta.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-[#1F3A5F]">
            Showing <span className="text-[#2E7D6B]">{sortedProducts.length}</span> Products
          </span>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1F3A5F] rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-base font-bold text-slate-700">No products found in this category.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-6 py-2.5 bg-[#1F3A5F] text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors"
            >
              Explore All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
