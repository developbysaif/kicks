import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import API, { FALLBACK_CATEGORIES } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

const CATEGORIES_DATA = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    count: '12 Products',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-amber-50/50',
    borderColor: 'border-amber-100'
  },
  {
    name: 'Laundry Care',
    slug: 'laundry-care',
    count: '10 Products',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-100'
  },
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    count: '15 Products',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-100'
  },
  {
    name: 'Dish Care',
    slug: 'dish-care',
    count: '8 Products',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-teal-50/50',
    borderColor: 'border-teal-100'
  },
  {
    name: 'Drain Care',
    slug: 'drain-care',
    count: '6 Products',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
  {
    name: 'Mosquito Protection',
    slug: 'mosquito-protection',
    count: '5 Products',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
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
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80'],
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
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'],
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
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'],
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
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'],
    isFeatured: true
  },
  {
    _id: 'p5',
    name: 'Kick Drain Opener',
    slug: 'kick-drain-opener',
    category: { name: 'Drain Care', slug: 'drain-care' },
    price: 520,
    salePrice: 0,
    rating: 5.0,
    numReviews: 170,
    volume: '1 Litre',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'],
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
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'],
    isFeatured: true
  }
];

const Home = () => {
  const [products, setProducts] = useState(INITIAL_FEATURED_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products?limit=20');
      if (res.data?.products && Array.isArray(res.data.products) && res.data.products.length > 0) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn('Using fallback products:', err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await API.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterStatus('Thank you for subscribing!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus('Subscribed successfully!');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* 1. HERO BANNER SECTION (FULL WIDTH - ATTACHED DIRECTLY TO HEADER WITH NO TOP/LEFT/RIGHT MARGINS) */}
      <section className="relative w-full overflow-hidden min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center bg-white border-b border-slate-100">
        
        {/* Background Image: kick.jpeg (Edge-to-Edge) */}
        <img
          src="/kick.jpeg"
          alt="Kara Asani Zindagi Main"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlaid Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
          
          {/* Top Left Text Block */}
          <div className="max-w-lg space-y-4 pt-2">
            
            {/* Red Pill Badge */}
            <div className="inline-block px-3.5 py-1 bg-red-600 text-white rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              PREMIUM HOME CARE PRODUCTS
            </div>

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
              <Link
                to="/shop"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs tracking-wide transition-colors flex items-center space-x-2 shadow-sm"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/shop"
                className="px-6 py-2.5 bg-white border border-red-600 text-red-600 hover:bg-red-50 rounded-full font-bold text-xs tracking-wide transition-colors"
              >
                Explore Categories
              </Link>
            </div>

          </div>

          {/* Bottom Row: 4 Feature Items (Left) + Carousel Arrows (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6">
            
            {/* 4 Feature Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight">
                  Premium Quality Products
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight">
                  Fast Delivery Across Pakistan
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight">
                  Secure Shopping 100% Safe
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight">
                  24/7 Customer Support
                </span>
              </div>
            </div>

            {/* Carousel Arrows */}
            <div className="flex items-center space-x-2 self-end">
              <button className="w-7 h-7 bg-white text-slate-700 hover:text-red-600 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 bg-white text-slate-700 hover:text-red-600 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* REST OF PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-14 w-full">

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
              to="/shop"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`group p-4 rounded-2xl border ${cat.borderColor} ${cat.bgColor} hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-white p-2 border border-slate-100 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
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
              to="/shop"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

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
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 min-h-[220px] sm:min-h-[250px] flex items-center bg-white shadow-sm group">
            
            {/* Background Image: img5.png */}
            <img
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
                to="/category/shoe-care"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors shadow-sm"
              >
                <span>Shop Shoe Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Banner 2: Home Cleaning */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 min-h-[220px] sm:min-h-[250px] flex items-center bg-white shadow-sm group">
            
            {/* Background Image: promo-clean.jpg */}
            <img
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
                to="/category/home-cleaning"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors shadow-sm"
              >
                <span>Explore Home Cleaning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </section>

        {/* 5. WHY CHOOSE US & WHAT OUR CUSTOMERS SAY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Trusted Quality</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Premium products you can rely on.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Effective Products</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Designed for real results.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Fast Delivery</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Across Pakistan.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Customer Satisfaction</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">We're here to help.</p>
                </div>
              </div>
            </div>
          </div>

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

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 relative space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-red-100 border border-red-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-red-600 text-sm">
                  AK
                </div>
                <div>
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
                  <button className="w-7 h-7 bg-white text-slate-600 rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:text-red-600">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 bg-white text-slate-600 rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:text-red-600">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. NEWSLETTER BANNER */}
      <section className="relative rounded-3xl overflow-hidden min-h-[180px] sm:min-h-[200px] flex items-center bg-white border border-slate-100 shadow-sm">
        
        {/* Background Image: img4.jpeg */}
        <img
          src="/img4.jpeg"
          alt="Subscribe to Our Newsletter"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlaid Content Container (Centered) */}
        <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-3">
          
          {/* Red Circle Mail Icon */}
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Mail className="w-6 h-6" />
          </div>

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

      </section>

      </div>
    </div>
  );
};

export default Home;
