'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Headphones,
  Target,
  Eye,
  Beaker,
  Heart,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Header />

      {/* 1. HERO BANNER SECTION (FULL WIDTH - ATTACHED DIRECTLY TO HEADER) */}
      <section className="relative w-full overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center bg-white border-b border-slate-100">
        
        {/* Background Image: kick.jpeg (Edge-to-Edge) */}
        <img
          src="/kick.jpeg"
          alt="About KICK Home Care"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlaid Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]">
          
          <div className="max-w-xl space-y-4 pt-4">
            
            {/* Red Pill Badge */}
            <div className="inline-block px-3.5 py-1 bg-red-600 text-white rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              ABOUT KICK HOME CARE
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              About KICK <br />
              Home Care
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
              Trusted home care products for a cleaner, healthier and happier home — because your home deserves the best.
            </p>
          </div>

          {/* Right Cursive Accent Tag */}
          <div className="self-end hidden sm:block font-serif italic text-2xl lg:text-3xl font-bold text-red-600 rotate-[-6deg]">
            Clean · Fresh · Safe
          </div>

        </div>

      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-16 w-full">
        
        {/* 2. WHO WE ARE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Who We Are
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
              KICK Home Care is a proud Pakistani brand that brings you high-quality home care products designed for everyday life.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              We specialize in practical, reliable and effective cleaning and care solutions that help you maintain a cleaner home, healthier living and a brighter tomorrow. From your shoes to your kitchen, bathroom to your surroundings — KICK has you covered.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors shadow-sm"
              >
                <span>Our Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-100 aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80"
                alt="Cleaner Homes Happier Lives"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-red-100 shadow-sm">
                <span className="font-serif italic text-sm sm:text-base font-bold text-red-600">
                  Cleaner Homes, Happier Lives
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* 3. OUR BRAND STORY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-100 aspect-[16/10] bg-slate-50 flex items-center justify-center p-4">
              <img
                src="/kick.jpeg"
                alt="A Brand Born from Care"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-red-100 shadow-sm">
                <span className="font-serif italic text-sm sm:text-base font-bold text-red-600">
                  A Brand Born from Care
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Brand Story
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
              KICK Home Care started with a simple belief — that every home deserves products that work, are safe and make life easier.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              What began as a commitment to quality and care has grown into a trusted name across Pakistan, helping millions of households keep their homes clean, fresh and well cared for.
            </p>
          </div>

        </section>

        {/* 4. MISSION & VISION GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Mission */}
          <div className="bg-red-50/40 rounded-3xl p-6 sm:p-8 border border-red-100 flex items-start space-x-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To provide high-quality, safe and affordable home care products that make everyday life cleaner, healthier and more convenient for every household in Pakistan.
              </p>
            </div>
          </div>

          {/* Card 2: Vision */}
          <div className="bg-sky-50/40 rounded-3xl p-6 sm:p-8 border border-sky-100 flex items-start space-x-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Eye className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Our Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To be the most trusted and loved home care brand in Pakistan, known for quality, innovation and care — today and for generations to come.
              </p>
            </div>
          </div>

        </section>

        {/* 5. WHY CHOOSE KICK */}
        <section className="space-y-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Why Choose KICK
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              We care about your home, your family and your peace of mind. That's why millions of households trust KICK.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Trusted Quality</h4>
              <p className="text-[11px] text-slate-500 font-medium">Premium products you can rely on.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Effective Results</h4>
              <p className="text-[11px] text-slate-500 font-medium">Real care, real results.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Fast Delivery</h4>
              <p className="text-[11px] text-slate-500 font-medium">Across Pakistan.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Customer Support</h4>
              <p className="text-[11px] text-slate-500 font-medium">We're here to help.</p>
            </div>

          </div>
        </section>

        {/* 6. OUR PRODUCT CATEGORIES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Our Product Categories
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Different needs. One trusted brand.
              </p>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 group"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
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

        {/* 7. QUALITY YOU CAN TRUST */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-100 aspect-square">
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80"
                alt="Quality You Can Trust"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Quality You Can Trust
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                Every KICK product is made with carefully selected ingredients and goes through strict quality checks to ensure it delivers the best results, every time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Safe Ingredients</h4>
                  <p className="text-[10px] text-slate-500">Formulated for family safety.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Beaker className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Quality Testing</h4>
                  <p className="text-[10px] text-slate-500">Rigorously lab tested.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Long-Lasting Performance</h4>
                  <p className="text-[10px] text-slate-500">Maximum value and care.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Family Safe</h4>
                  <p className="text-[10px] text-slate-500">Gentle yet effective.</p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* 8. OUR JOURNEY IN NUMBERS */}
        <section className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-100 space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Journey in Numbers
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              A growing family, trusted across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            
            <div className="text-center p-4">
              <span className="text-3xl sm:text-4xl font-black text-red-600 block">5+</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-1 block">
                Product Categories
              </span>
            </div>

            <div className="text-center p-4 border-l border-slate-200/60">
              <span className="text-3xl sm:text-4xl font-black text-red-600 block">1M+</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-1 block">
                Happy Households
              </span>
            </div>

            <div className="text-center p-4 border-l border-slate-200/60">
              <span className="text-3xl sm:text-4xl font-black text-red-600 block">10+</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-1 block">
                Years of Trust
              </span>
            </div>

            <div className="text-center p-4 hidden md:block border-l border-slate-200/60">
              <span className="font-serif italic text-2xl font-bold text-red-600 rotate-[-6deg] block">
                Growing Together
              </span>
            </div>

          </div>
        </section>

        {/* 9. CARE FOR YOUR HOME. CARE FOR YOUR LIFE. */}
        <section className="relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center bg-white border border-slate-100 shadow-sm">
          
          <img
            src="/kick.jpeg"
            alt="Care for Your Home. Care for Your Life."
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="relative z-10 w-full p-8 sm:p-12 space-y-4 max-w-lg">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Care for Your Home. <br />
              Care for Your Life.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Choose KICK Home Care for a cleaner, healthier and happier home — because you deserve the best.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
