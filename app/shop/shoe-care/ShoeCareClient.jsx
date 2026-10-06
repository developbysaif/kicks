'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Wind,
  Wrench,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  Heart,
  Scale,
  Star,
  Eye,
  ShoppingBag,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickViewModal from '@/components/QuickViewModal';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';

// Color palette constants for strict adherence
// Primary: #1F3A5F | Secondary: #2E7D6B | Background: #F7F8F6 | Accent: #F4B942 | Text: #1E293B

const SUB_CATEGORIES = [
  { id: 'all', name: 'All Products', count: 8, icon: '✨' },
  { id: 'cleaners', name: 'Shoe Cleaners', count: 3, icon: '🧼', desc: 'Foam & liquid cleansers for instant grime removal' },
  { id: 'sneaker-care', name: 'Sneaker Care', count: 2, icon: '👟', desc: 'Specialized whiteners & sole scrub formulations' },
  { id: 'leather-care', name: 'Leather Care', count: 3, icon: '👞', desc: 'Nourishing wax creams and high-gloss polish' },
  { id: 'protectors', name: 'Shoe Protectors', count: 1, icon: '🛡️', desc: 'Hydrophobic nano-coatings against rain and stains' },
  { id: 'brushes', name: 'Cleaning Brushes', count: 1, icon: '🪥', desc: 'Ergonomic horsehair & synthetic bristle tools' },
  { id: 'fresheners', name: 'Shoe Fresheners', count: 1, icon: '🌿', desc: 'Active antibacterial deodorizer sprays' }
];

const PRODUCTS_DATA = [
  {
    _id: 'sc-1',
    name: 'Kick Whito - White Sneaker & Joggers Cleaner',
    slug: 'kick-whito-white-sneaker-cleaner',
    categoryType: 'sneaker-care',
    material: 'Sneaker / Canvas',
    brand: 'Kick Home Care',
    inStock: true,
    price: 420,
    salePrice: 380,
    rating: 5.0,
    numReviews: 82,
    volume: '500ml Applicator',
    shortDescription: 'Restores brilliant optic white glow to midsoles, rubber caps, and sports canvas with built-in sponge.',
    images: ['/Shoe Care.png', '/promo-shoe.jpg'],
    isFeatured: true,
    isBestSeller: true,
    badge: '-10% OFF'
  },
  {
    _id: 'sc-2',
    name: 'Kick Super Liquid Shoe Polish (Black / Brown / Neutral)',
    slug: 'kick-super-liquid-shoe-polish',
    categoryType: 'leather-care',
    material: 'Leather',
    brand: 'Kick Professional',
    inStock: true,
    price: 520,
    salePrice: 0,
    rating: 5.0,
    numReviews: 72,
    volume: '75ml Bottle',
    shortDescription: 'Enriched with genuine Brazilian carnauba wax for deep leather nourishing, waterproof seal, and instant shine.',
    images: ['/liquid shoe polish.png', '/Shoe Care.png'],
    isFeatured: true,
    isBestSeller: true,
    badge: 'BESTSELLER'
  },
  {
    _id: 'sc-3',
    name: 'Kick Active Foam Sneaker Cleanser',
    slug: 'kick-active-foam-sneaker-cleanser',
    categoryType: 'cleaners',
    material: 'Sneaker / Canvas',
    brand: 'Kick Sport',
    inStock: true,
    price: 490,
    salePrice: 440,
    rating: 4.9,
    numReviews: 114,
    volume: '200ml Active Pump',
    shortDescription: 'Ready-to-use self-foaming solution that breaks down stubborn street grime, dirt, and coffee stains effortlessly.',
    images: ['/Shoe Care.png', '/shoe-care-hero.jpg'],
    isFeatured: true,
    isBestSeller: false,
    badge: '-10% OFF'
  },
  {
    _id: 'sc-4',
    name: 'Kick Hydrophobic Shield Rain & Stain Protector',
    slug: 'kick-hydrophobic-shield-protector',
    categoryType: 'protectors',
    material: 'All Materials',
    brand: 'Kick Professional',
    inStock: true,
    price: 650,
    salePrice: 590,
    rating: 4.9,
    numReviews: 93,
    volume: '250ml Aerosol',
    shortDescription: 'Breathable nano-coating barrier repelling liquids, rainwater, road slush, and dust for up to 4 weeks.',
    images: ['/Shoe Care.png', '/shoe-care-hero.jpg'],
    isFeatured: true,
    isBestSeller: true,
    badge: 'POPULAR'
  },
  {
    _id: 'sc-5',
    name: 'Kick Ergonomic 100% Horsehair Shoe Brush',
    slug: 'kick-ergonomic-horsehair-shoe-brush',
    categoryType: 'brushes',
    material: 'Leather',
    brand: 'Kick Professional',
    inStock: true,
    price: 320,
    salePrice: 280,
    rating: 4.8,
    numReviews: 64,
    volume: 'Solid Hardwood Handle',
    shortDescription: 'Ultra-soft dense natural horsehair bristles buff polish to mirror luster without scratching tender leather grains.',
    images: ['/Shoe Care.png', '/shoes cleaning.jpg.jpeg'],
    isFeatured: false,
    isBestSeller: false,
    badge: '-13% OFF'
  },
  {
    _id: 'sc-6',
    name: 'Kick Fresh Shoe & Sneaker Deodorizer Spray',
    slug: 'kick-fresh-shoe-deodorizer-spray',
    categoryType: 'fresheners',
    material: 'All Materials',
    brand: 'Kick Home Care',
    inStock: true,
    price: 380,
    salePrice: 340,
    rating: 4.9,
    numReviews: 78,
    volume: '150ml Mist Spray',
    shortDescription: 'Botanical tea tree & eucalyptus formula neutralizes microbial odors at the source for round-the-clock fresh footwear.',
    images: ['/Shoe Care.png', '/shoe-care-hero.jpg'],
    isFeatured: false,
    isBestSeller: false,
    badge: 'FRESH'
  },
  {
    _id: 'sc-7',
    name: 'Kick Super Wax Shoe Polish Tin 50g',
    slug: 'kick-super-wax-shoe-polish-tin',
    categoryType: 'leather-care',
    material: 'Leather',
    brand: 'Kick Home Care',
    inStock: true,
    price: 240,
    salePrice: 220,
    rating: 4.9,
    numReviews: 152,
    volume: '50g Classic Metal Tin',
    shortDescription: 'Heritage military-grade solid beeswax formula for deep recoloring, scuff concealing, and mirror spit shine.',
    images: ['/Shoe Care.png', '/shoes cleaning.jpg.jpeg'],
    isFeatured: false,
    isBestSeller: true,
    badge: 'VALUE PACK'
  },
  {
    _id: 'sc-8',
    name: 'Kick Instant Shiner Silicone Travel Sponge',
    slug: 'kick-instant-shiner-silicone-sponge',
    categoryType: 'cleaners',
    material: 'Leather',
    brand: 'Kick Home Care',
    inStock: true,
    price: 220,
    salePrice: 190,
    rating: 4.7,
    numReviews: 59,
    volume: 'Pre-oiled Travel Casing',
    shortDescription: 'Mess-free pocket silicone sponge applicator providing an instant glossy mirror touch-up before business meetings.',
    images: ['/Shoe Care.png', '/promo-shoe.jpg'],
    isFeatured: false,
    isBestSeller: false,
    badge: '-14% OFF'
  }
];

const SHOP_BY_NEEDS = [
  {
    title: 'Everyday Shoe Cleaning',
    subtitle: 'Daily quick dust & scuff removal',
    icon: '⚡',
    action: 'cleaners',
    color: 'from-blue-900/90 to-slate-900',
    description: 'Keep regular office footwear and casual slip-ons presentable without lengthy soaking or mess.'
  },
  {
    title: 'Sneaker Cleaning',
    subtitle: 'White rubber soles & knit uppers',
    icon: '👟',
    action: 'sneaker-care',
    color: 'from-emerald-950/90 to-slate-900',
    description: 'Specialized stain lift formulas designed to bring yellowed boost midsoles back to original brightness.'
  },
  {
    title: 'Leather Protection',
    subtitle: 'Wax replenishment & moisture barrier',
    icon: '👞',
    action: 'leather-care',
    color: 'from-amber-950/90 to-slate-900',
    description: 'Preserve natural hide oils, prevent fine creases from cracking, and enhance rich color tones.'
  },
  {
    title: 'Odor Control',
    subtitle: 'Microbial neutralization',
    icon: '🌿',
    action: 'fresheners',
    color: 'from-teal-950/90 to-slate-900',
    description: 'Essential oils and antimicrobial agents keep trainers and gym shoes hygienic and crisp.'
  },
  {
    title: 'Deep Cleaning',
    subtitle: 'Heavy mud & seasonal restoration',
    icon: '🫧',
    action: 'cleaners',
    color: 'from-indigo-950/90 to-slate-900',
    description: 'Tough foaming concentrates with stiff-bristle brushes for post-rainstorm and trail footwear.'
  }
];

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Easy Cleaning',
    description: 'Quick-acting foaming chemistry lifts ground-in dirt in seconds without abrasive scouring or color fading.'
  },
  {
    icon: ShieldCheck,
    title: 'Footwear Protection',
    description: 'Invisible breathable barrier shields delicate leather and canvas from monsoon rain, mud, and everyday spills.'
  },
  {
    icon: Wind,
    title: 'Lasting Freshness',
    description: 'Botanical extracts eliminate perspiration odors at the bacterial root rather than simply masking them.'
  },
  {
    icon: Wrench,
    title: 'Everyday Maintenance',
    description: 'Formulations engineered to nourish organic leathers and preserve sports mesh flexibility year after year.'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose the Right Product',
    desc: 'Match your shoe upper material: smooth leather, sports mesh, durable canvas, or delicate suede.'
  },
  {
    step: '02',
    title: 'Clean and Care',
    desc: 'Dispense cleaner foam or polish evenly with an ergonomic brush, wiping excess moisture with a clean microfiber towel.'
  },
  {
    step: '03',
    title: 'Maintain Your Footwear',
    desc: 'Finish with a light mist of water-repellent protector or wax buff to lock out road grime and preserve luster.'
  }
];

const REVIEWS = [
  {
    name: 'Hamza Farooq',
    city: 'Lahore',
    rating: 5,
    date: 'September 24, 2026',
    product: 'Kick Whito Sneaker Cleaner',
    comment: 'Transformed my white sneakers that had yellowed along the midsole. Used the built-in sponge applicator and wiped clean after two minutes. Looked brand new.'
  },
  {
    name: 'Usman Tariq',
    city: 'Karachi',
    rating: 5,
    date: 'September 18, 2026',
    product: 'Kick Super Liquid Shoe Polish',
    comment: 'The Black shade gives an impeccable shine without the sticky residue other local brands leave behind. Safe for formal dress shoes.'
  },
  {
    name: 'Zainab Bilal',
    city: 'Islamabad',
    rating: 5,
    date: 'September 11, 2026',
    product: 'Hydrophobic Rain Protector Spray',
    comment: 'Sprayed on my suede loafers before monsoon rains. Water droplets literally rolled off the surface without leaving a single dark watermark.'
  }
];

const FAQS = [
  {
    q: 'What shoe materials can these products be used on?',
    a: 'Our shoe care range covers smooth full-grain leather, artificial PU leather, canvas, athletic mesh, and knit uppers. For delicate suede or nubuck, we advise dry-brushing and our dedicated protector spray rather than thick liquid waxes.'
  },
  {
    q: 'How often should I clean my shoes?',
    a: 'For footwear worn daily, light dusting with a horsehair brush after each wear takes only 30 seconds and prevents embedded grit. Deep foam cleaning or polish buffing is typically needed once every 2 to 3 weeks.'
  },
  {
    q: 'Can shoe cleaner be used on sneakers?',
    a: 'Absolutely. Kick Whito and Kick Active Foam Cleanser are formulated specifically for athletic sneakers, rubber outsoles, and synthetic knit fabrics to lift street dirt without yellowing white rubber.'
  },
  {
    q: 'How should leather shoes be maintained?',
    a: 'Always remove surface dust first using a horsehair brush. Apply a moderate coat of Kick Super Liquid Polish or Wax Tin evenly, let the waxes penetrate for 5 minutes, and finish by briskly buffing with a clean brush for a deep, natural luster.'
  }
];

export default function ShoeCareClient() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_DATA];

    // Category Type
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryType === selectedCategory);
    }

    // Price
    if (priceFilter === 'under-300') {
      result = result.filter((p) => (p.salePrice > 0 ? p.salePrice : p.price) < 300);
    } else if (priceFilter === '300-500') {
      result = result.filter((p) => {
        const val = p.salePrice > 0 ? p.salePrice : p.price;
        return val >= 300 && val <= 500;
      });
    } else if (priceFilter === 'above-500') {
      result = result.filter((p) => (p.salePrice > 0 ? p.salePrice : p.price) > 500);
    }

    // Brand
    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Material
    if (selectedMaterial !== 'all') {
      result = result.filter((p) => p.material === selectedMaterial || p.material === 'All Materials');
    }

    // Rating
    if (selectedRating === '4.8') {
      result = result.filter((p) => p.rating >= 4.8);
    } else if (selectedRating === '4.5') {
      result = result.filter((p) => p.rating >= 4.5);
    }

    // Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.numReviews - a.numReviews);
    }

    return result;
  }, [selectedCategory, priceFilter, selectedBrand, selectedMaterial, selectedRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceFilter('all');
    setSelectedBrand('all');
    setSelectedMaterial('all');
    setSelectedRating('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedMaterial !== 'all' ? 1 : 0) +
    (selectedRating !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] font-sans antialiased selection:bg-[#D0161D] selection:text-white">
      {/* 1. GLOBAL HEADER WITH ANNOUNCEMENT BAR & CURRENT CATEGORY HIGHLIGHT */}
      <Header />

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* 2. BREADCRUMB */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/shop" className="hover:text-red-600 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-red-600 font-bold" aria-current="page">
              Shoe Care
            </span>
          </nav>
        </div>
      </div>

      <main className="flex-1">
        {/* 3. PREMIUM HERO SECTION — Full Background Image */}
        <section
          className="relative overflow-hidden text-white min-h-[420px] sm:min-h-[520px] flex items-end"
          style={{
            backgroundImage: "url('/Shoe%20Main%20Category%20Banner.jpg.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Layered overlays: dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 relative z-10 w-full">
            <div className="max-w-2xl space-y-5">

              {/* Brand chip */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D0161D] text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kick® Professional Footwear Maintenance</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Keep Your Shoes{' '}
                <br className="hidden sm:inline" />
                <span className="text-[#D0161D]">Looking Like New</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 max-w-xl font-normal leading-relaxed">
                Discover practical shoe care solutions designed to clean, protect and maintain your favorite footwear — engineered for sneakers, formal leathers, sports mesh, and everyday trainers.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#products-section"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#D0161D] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <span>Shop Shoe Care</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#categories-sub"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/30 transition-all duration-200"
                >
                  <span>Explore Products</span>
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-5 border-t border-white/15 grid grid-cols-3 gap-4 text-slate-300 text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Safe on Leather</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Optical Brighteners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Non-Corrosive</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. CATEGORY INTRO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">
                Footwear Hygiene &amp; Longevity
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Shoe Care Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you step out in crisp white sneakers, fine leather oxfords, or casual everyday trainers, proper footwear maintenance extends shoe lifespan and preserves aesthetic appeal. Discover our comprehensive range of specialized shoe cleaners, conditioning waxes, hydrophobic protector sprays, and ergonomic brushes tailored to care for leather, suede, nubuck, canvas, and mesh without damaging sensitive fibers.
              </p>
            </div>
          </div>
        </section>

        {/* 5. PRODUCT SUB-CATEGORIES (CARDS) */}
        <section id="categories-sub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]">
              Browse by Sub-Category
            </h3>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[#D0161D] hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {SUB_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const prodSection = document.getElementById('products-section');
                    if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#D0161D] text-white border-[#D0161D] shadow-md scale-102'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-[#D0161D]/40 hover:shadow-sm'
                  }`}
                >
                  <span className="text-2xl mb-2">{cat.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1">{cat.name}</h4>
                    <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {cat.count} Items
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. MAIN PRODUCT SECTION WITH FILTERS & SORT */}
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: Results Count & Active Category Badge */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-[#1A1A1A]">
                Showing <span className="text-[#D0161D]">{filteredProducts.length}</span> Products
              </span>
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 bg-red-50 text-[#D0161D] text-[11px] font-bold rounded-full flex items-center space-x-1 border border-red-100">
                  <span>{SUB_CATEGORIES.find((c) => c.id === selectedCategory)?.name}</span>
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-red-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Right: Mobile Filter Trigger & Desktop Sort */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#1A1A1A] flex items-center space-x-2 shadow-xs"
              >
                <Filter className="w-3.5 h-3.5 text-[#D0161D]" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1A1A1A] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* DESKTOP SIDEBAR FILTERS (4 Columns) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-[#D0161D] font-black text-sm uppercase tracking-wide">
                  <SlidersHorizontal className="w-4 h-4 text-[#D0161D]" />
                  <span>Filter Products</span>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Filter 1: Product Type */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Product Type</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {SUB_CATEGORIES.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center justify-between cursor-pointer hover:text-[#D0161D] py-1"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="desktop-category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="text-[#D0161D] focus:ring-[#D0161D]"
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 2: Price Range */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Price Range</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-300', label: 'Under Rs. 300' },
                    { id: '300-500', label: 'Rs. 300 to Rs. 500' },
                    { id: 'above-500', label: 'Above Rs. 500' }
                  ].map((p) => (
                    <label key={p.id} className="flex items-center space-x-2 cursor-pointer hover:text-[#D0161D] py-1">
                      <input
                        type="radio"
                        name="desktop-price"
                        checked={priceFilter === p.id}
                        onChange={() => setPriceFilter(p.id)}
                        className="text-[#D0161D] focus:ring-[#D0161D]"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 3: Shoe Material */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Shoe Material</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['all', 'Leather', 'Sneaker / Canvas', 'All Materials'].map((mat) => (
                    <label key={mat} className="flex items-center space-x-2 cursor-pointer hover:text-[#D0161D] py-1">
                      <input
                        type="radio"
                        name="desktop-material"
                        checked={selectedMaterial === mat}
                        onChange={() => setSelectedMaterial(mat)}
                        className="text-[#D0161D] focus:ring-[#D0161D]"
                      />
                      <span className="capitalize">{mat === 'all' ? 'All Materials' : mat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 4: Brand */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Brand</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['all', 'Kick Home Care', 'Kick Professional', 'Kick Sport'].map((brand) => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:text-[#D0161D] py-1">
                      <input
                        type="radio"
                        name="desktop-brand"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="text-[#D0161D] focus:ring-[#D0161D]"
                      />
                      <span>{brand === 'all' ? 'All Brands' : brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 5: Availability */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer py-1 text-xs font-bold text-[#D0161D]">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#D0161D] focus:ring-[#D0161D] w-4 h-4"
                  />
                </label>
              </div>

            </aside>

            {/* PRODUCT GRID (9 Columns) */}
            <div className="lg:col-span-9">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-[#D0161D]">No shoe care products match your filters</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try broadening your selection or resetting filters to explore our full shoe care lineup.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-5 px-5 py-2.5 bg-[#D0161D] text-white text-xs font-bold rounded-full hover:bg-red-800 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const isWish = isInWishlist(product._id);
                    const currentPrice = product.salePrice > 0 ? product.salePrice : product.price;
                    const originalPrice = product.salePrice > 0 ? product.price : null;

                    return (
                      <motion.div
                        key={product._id}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
                      >
                        {/* Image Container with Badges */}
                        <div className="relative aspect-square w-full rounded-2xl bg-gray-50 mb-4 flex items-center justify-center overflow-hidden border border-slate-100">
                          
                          {/* Badges Top Left */}
                          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                            {product.badge && (
                              <span className="px-2.5 py-1 bg-[#D0161D] text-white text-[10px] font-black rounded-lg shadow-xs tracking-wider uppercase">
                                {product.badge}
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="px-2 py-0.5 bg-[#FFD700] text-[#D0161D] text-[9px] font-black rounded-md shadow-xs uppercase tracking-wider">
                                Top Seller
                              </span>
                            )}
                          </div>

                          {/* Action Buttons Top Right */}
                          <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleWishlist(product)}
                              className={`p-2 rounded-full shadow-sm transition-colors ${
                                isWish ? 'bg-red-600 text-white' : 'bg-white text-slate-400 hover:text-red-600 border border-slate-100'
                              }`}
                              title="Add to Wishlist"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current' : ''}`} />
                            </button>

                            <button
                              onClick={() => addToCompare(product)}
                              className="p-2 bg-white text-slate-400 hover:text-[#D0161D] rounded-full shadow-sm border border-slate-100 transition-colors"
                              title="Compare"
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setQuickViewProduct(product)}
                              className="p-2 bg-white text-slate-400 hover:text-[#D0161D] rounded-full shadow-sm border border-slate-100 transition-colors"
                              title="Quick View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Product Image Link */}
                          <Link href={`/product/${product.slug}`} className="block w-full h-full">
                            <motion.img
                              whileHover={{ scale: 1.06 }}
                              transition={{ duration: 0.3 }}
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Material & Volume tag */}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                              <span>{product.material}</span>
                              <span className="font-mono text-slate-500">{product.volume}</span>
                            </div>

                            {/* Title */}
                            <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#D0161D] transition-colors line-clamp-2 mt-1">
                              {product.name}
                            </h4>

                            {/* Short Description */}
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {product.shortDescription}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 space-y-3">
                            {/* Stars & Reviews */}
                            <div className="flex items-center space-x-1.5 text-xs">
                              <div className="flex items-center text-[#FFD700]">
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </div>
                              <span className="font-black text-slate-800 text-[11px]">{product.rating.toFixed(1)}</span>
                              <span className="text-[11px] text-slate-400">({product.numReviews})</span>
                            </div>

                            {/* Price Row & Add to Cart */}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm sm:text-base font-black text-[#D0161D]">
                                  Rs. {currentPrice}
                                </span>
                                {originalPrice && (
                                  <span className="text-xs text-slate-400 line-through ml-2">
                                    Rs. {originalPrice}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => addToCart(product, '', 1)}
                                className="px-3.5 py-2 bg-[#D0161D] hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 7. SHOP BY NEED SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Targeted Care</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Shop Footwear By Need
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your immediate shoe care objective to find formulas tailored to the job.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SHOP_BY_NEEDS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(item.action);
                  const prodSection = document.getElementById('products-section');
                  if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative rounded-3xl overflow-hidden p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#f9f9f9] border border-slate-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#D0161D] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#D0161D] group-hover:translate-x-1 transition-transform">
                  <span>Explore Products</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. BENEFITS SECTION */}
        <section className="bg-white border-y border-slate-200/80 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Quality Assurance</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Why Choose Kick® Shoe Care?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Crafted with balanced pH chemistry to lift stubborn grease and road grime while safeguarding original dyes and leathers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((b, i) => {
                const IconComponent = b.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-[#f9f9f9] border border-slate-100 flex flex-col items-start space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#D0161D] flex items-center justify-center shadow-xs border border-slate-200/60">
                      <IconComponent className="w-6 h-6 text-[#D0161D]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{b.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. HOW IT WORKS (3 STEPS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Expert Methodology</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              How It Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Three simple steps to restore and protect your entire footwear collection at home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-[#D0161D]/15 font-mono block mb-3">
                    {step.step}
                  </span>
                  <h4 className="text-base font-bold text-[#1A1A1A] mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#D0161D]">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span>Kick Certified Step</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. CUSTOMER REVIEWS */}
        <section className="bg-white border-y border-slate-200/80 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Verified Feedback</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                What Customers Say About Our Shoe Care
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((rev, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#f9f9f9] border border-slate-100 space-y-4">
                  <div className="flex items-center space-x-1 text-[#FFD700]">
                    {[...Array(rev.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-[#1A1A1A]">{rev.name}</h5>
                      <span className="text-[11px] text-slate-400">{rev.city} • {rev.product}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. FAQ ACCORDION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Common Questions</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear, practical advice for maintaining footwear materials.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, fIdx) => {
              const isOpen = activeFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#1A1A1A] hover:text-[#D0161D] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D0161D]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 12. COMPREHENSIVE SEO CONTENT SECTION (550+ words natural text) */}
        <section className="bg-white border-t border-slate-200/80 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">Shoe Care Guide</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Shoe Care Products for Everyday Footwear
              </h2>
            </div>

            <p>
              Footwear endures more daily mechanical friction, environmental dust, moisture exposure, and chemical grime than virtually any other garment in your wardrobe. In Pakistani urban conditions, unpaved road dust, high ambient humidity, and intense sunlight accelerate the drying out of organic leathers and yellowing of sports sneaker soles. Implementing a structured shoe care regimen not only keeps your dress shoes and casual footwear looking pristine, but actively prolongs their structural lifespan by preventing leather cracking, seam separation, and bacterial breakdown.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] pt-2">
              Shoe Cleaning: Lifting Atmospheric Grime
            </h3>
            <p>
              Standard household bar soaps and abrasive laundry detergents contain harsh sodium salts and elevated alkalinity that strip leather hides of their natural essential lubricants. Kick specialized shoe cleaners are formulated at neutral pH levels, lifting grease and surface dirt via high-density foaming action rather than harsh chemical scouring. By suspending particulate matter on the surface, dirt can be gently lifted away with our natural horsehair brush or a damp microfiber cloth without soaking the interior lining.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] pt-2">
              Sneaker Care: Preserving Optical Brightness
            </h3>
            <p>
              White sneakers have become an indispensable staple of modern smart-casual attire. However, porous ethylene-vinyl acetate (EVA) and polyurethane (PU) boost midsoles readily absorb dirt particles and oxidize over time when exposed to ultraviolet rays. Kick Whito sneaker cleaner incorporates mild optical brighteners specifically engineered to restore original white tones without causing brittle foam erosion. For knit and canvas uppers, our active foam solution breaks down stubborn coffee, beverage, and oil stains while keeping flexible threads soft and pliable.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] pt-2">
              Leather Care: Nourishing Natural Hides
            </h3>
            <p>
              Natural calfskin, cowhide, and finished leathers require regular replenishment of fats and oils to maintain suppleness. Kick Super Liquid Polish and traditional Wax Tins are formulated with genuine carnauba wax and rich pigments. As the waxes penetrate the pores, they replenish dry areas, smooth minor surface scuffs, and create a resilient top barrier against water and dirt. Buffing with a clean horsehair brush warms the wax layers, generating a refined, professional sheen appropriate for formal oxford shoes and work boots.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] pt-2">
              Shoe Protection and Daily Maintenance
            </h3>
            <p>
              Prevention remains the most effective form of shoe maintenance. Applying a breathable hydrophobic protector spray prior to stepping out seals fibers against unexpected downpours and muddy street splashes. Combined with botanical deodorizing sprays that eliminate odor-producing bacteria inside footwear, maintaining your footwear collection becomes a simple, rewarding routine that protects your investment in quality footwear.
            </p>

          </div>
        </section>

      </main>

      {/* MOBILE FILTER BOTTOM SHEET / DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-[#D0161D] font-black text-sm uppercase">
                  <Filter className="w-4 h-4 text-[#D0161D]" />
                  <span>Filter Products</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-Category Filter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#D0161D] uppercase">Product Type</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {SUB_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2 rounded-xl text-left border ${
                        selectedCategory === cat.id
                          ? 'bg-[#D0161D] text-white border-[#D0161D]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#D0161D] uppercase">Price</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under-300', label: '< Rs. 300' },
                    { id: '300-500', label: 'Rs. 300 - 500' },
                    { id: 'above-500', label: '> Rs. 500' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriceFilter(p.id)}
                      className={`p-2 rounded-xl text-left border ${
                        priceFilter === p.id
                          ? 'bg-[#D0161D] text-white border-[#D0161D]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#D0161D]">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#D0161D] focus:ring-[#D0161D] w-4 h-4"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-[#D0161D] text-white text-xs font-bold rounded-xl"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 13. GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}
