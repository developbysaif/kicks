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
  Leaf,
  Users,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CATEGORIES_DATA = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    count: '12 Products',
    image: '/Shoe Care.png',
    href: '/shop/shoe-care'
  },
  {
    name: 'Laundry Care',
    slug: 'laundry-care',
    count: '10 Products',
    image: '/laundry Care.png',
    href: '/category/laundry-care'
  },
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    count: '15 Products',
    image: '/Home Cleaning.png',
    href: '/category/home-cleaning'
  },
  {
    name: 'Dish Care',
    slug: 'dish-care',
    count: '8 Products',
    image: '/dish care.png',
    href: '/category/dish-care'
  },
  {
    name: 'Drain Care',
    slug: 'washroom-cleaning',
    count: '6 Products',
    image: '/washroom cleaning.png',
    href: '/category/washroom-cleaning'
  },
  {
    name: 'Mosquito Protection',
    slug: 'mosquito-protection',
    count: '5 Products',
    image: '/mosquito protection.png',
    href: '/category/mosquito-protection'
  }
];

const WHY_CHOOSE = [
  {
    icon: ShieldCheck,
    title: 'Trusted Quality',
    desc: 'Premium products you can rely on.'
  },
  {
    icon: Sparkles,
    title: 'Effective Results',
    desc: 'Real care, real results.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Across Pakistan.'
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    desc: "We're here to help."
  }
];

const QUALITY_ICONS = [
  { icon: Leaf, label: 'Safe Ingredients' },
  { icon: CheckCircle2, label: 'Quality Testing' },
  { icon: ShieldCheck, label: 'Long-Lasting Performance' },
  { icon: Users, label: 'Family Safe' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Header />

      {/* ─────────────────────────────────────────────
          1. HERO BANNER
      ───────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Text */}
          <div className="space-y-5">
            {/* Label */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D0161D]/10 border border-[#D0161D]/20">
              <span className="w-2 h-2 bg-[#D0161D] rounded-full" />
              <span className="text-[11px] font-bold text-[#D0161D] uppercase tracking-widest">About Kick Home Care</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] leading-tight tracking-tight">
              About <span className="text-[#D0161D]">KICK</span><br />Home Care
            </h1>

            {/* Red underline accent */}
            <div className="flex items-center space-x-1">
              <span className="block h-1 w-10 bg-[#D0161D] rounded-full" />
              <span className="block h-1 w-4 bg-[#D0161D]/40 rounded-full" />
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              Trusted home care products for a cleaner, healthier and happier home — because your home deserves the best.
            </p>
          </div>

          {/* Right: Hero Product Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            <img
              src="/about-hero-products.jpg"
              alt="KICK Home Care Product Range — Clean Fresh Safe"
              className="w-full h-[280px] sm:h-[340px] object-cover object-center"
            />
            {/* "Clean Fresh Safe" badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md border border-slate-100 text-center">
              <p className="text-[11px] font-black text-[#D0161D] uppercase tracking-wide leading-tight">
                Clean<br />Fresh<br />Safe
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. WHO WE ARE
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div className="space-y-5">
            {/* Section label */}
            <div className="flex items-center space-x-2">
              <span className="block h-0.5 w-8 bg-[#D0161D]" />
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-widest">Who We Are</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Who We Are
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              KICK Home Care is a proud Pakistani brand that brings you high-quality home care products designed for everyday life.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We specialize in practical, reliable and effective cleaning and care solutions that help you maintain a cleaner home, healthier living and a brighter tomorrow. From your shoes to your kitchen, bathroom to your surroundings — KICK has you covered.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#D0161D] text-white text-xs font-bold rounded-full hover:bg-red-800 transition-colors"
            >
              <span>Our Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: Mother & Child Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/about-who-we-are.jpg"
              alt="Pakistani family enjoying a clean home with KICK Home Care products"
              className="w-full h-[320px] sm:h-[380px] object-cover object-center"
            />
            {/* "Cleaner Homes Happier Lives" overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white font-black text-lg sm:text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>
                Cleaner Homes<br />Happier Lives
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. BRAND STORY
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Brand Story Image with "A Brand Born from Care" */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
            <img
              src="/about-brand-story.jpg"
              alt="KICK Home Care — A Brand Born from Care, Made in Pakistan"
              className="w-full h-[320px] sm:h-[380px] object-cover object-center"
            />
            {/* Overlay badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border border-slate-100 max-w-[160px]">
              <p className="text-[#D0161D] font-black text-sm italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                A Brand<br />Born from<br />
                <span className="text-[#1A1A1A] not-italic">Care</span>
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="space-y-5 order-1 lg:order-2">
            <div className="flex items-center space-x-2">
              <span className="block h-0.5 w-8 bg-[#D0161D]" />
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-widest">Our Story</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Our Brand Story
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              KICK Home Care started with a simple belief — that every home deserves products that work, are safe and make life easier.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              What began as a commitment to quality and care has grown into a trusted name across Pakistan, helping millions of households keep their homes clean, fresh and well cared for.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. MISSION & VISION
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Our Mission */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#D0161D]/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#D0161D]" />
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A]">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To provide high-quality, safe and affordable home care products that make everyday life cleaner, healthier and more convenient for every household in Pakistan.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#D0161D]/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#D0161D]" />
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A]">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be the most trusted and loved home care brand in Pakistan, known for quality, innovation and care — today and for generations to come.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. WHY CHOOSE KICK
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="block h-0.5 w-8 bg-[#D0161D]" />
                <span className="text-xs font-bold text-[#D0161D] uppercase tracking-widest">Our Promise</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Why Choose KICK
              </h2>
              <p className="text-sm text-slate-500">
                We care about your home, your family and your peace of mind.<br className="hidden sm:inline" />
                That's why millions of households trust KICK.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md hover:border-[#D0161D]/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-[#D0161D]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#D0161D]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A1A]">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          6. OUR PRODUCT CATEGORIES
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="block h-0.5 w-8 bg-[#D0161D]" />
                <span className="text-xs font-bold text-[#D0161D] uppercase tracking-widest">Different Needs, One Trusted Brand</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Our Product Categories
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center space-x-1 text-xs font-bold text-[#D0161D] hover:underline"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center text-center space-y-3 hover:border-[#D0161D]/40 hover:shadow-md transition-all"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#D0161D] transition-colors">{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cat.count}</p>
                </div>
                <div className="flex items-center text-[10px] font-bold text-[#D0161D] space-x-0.5">
                  <span>Shop</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile "Explore All" */}
          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/shop"
              className="flex items-center space-x-1 text-xs font-bold text-[#D0161D] hover:underline"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          7. QUALITY YOU CAN TRUST
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/about-quality-trust.jpg"
              alt="KICK Home Care Quality Testing — Safe Ingredients, Family Trusted"
              className="w-full h-[300px] sm:h-[360px] object-cover object-center"
            />
          </div>

          {/* Right: Text + icons */}
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="block h-0.5 w-8 bg-[#D0161D]" />
                <span className="text-xs font-bold text-[#D0161D] uppercase tracking-widest">Our Standards</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Quality You Can Trust
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Every KICK product is made with carefully selected ingredients and goes through strict quality checks to ensure it delivers the best results, every time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {QUALITY_ICONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-[#D0161D]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#D0161D]" />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          8. OUR JOURNEY IN NUMBERS
      ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="block h-0.5 w-8 bg-[#D0161D]" />
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-widest">A growing family trusted across Pakistan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Our Journey in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Stat 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <p className="text-4xl sm:text-5xl font-black text-[#D0161D]">5+</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-2">Product Categories</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <p className="text-4xl sm:text-5xl font-black text-[#D0161D]">1M+</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-2">Happy Households</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <p className="text-4xl sm:text-5xl font-black text-[#D0161D]">10+</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-2">Years of Trust</p>
            </div>

            {/* Growing Together */}
            <div className="bg-[#D0161D] rounded-3xl p-8 text-white text-center flex flex-col items-center justify-center space-y-3 shadow-lg">
              <Sparkles className="w-10 h-10 text-white/80" />
              <p className="text-xl sm:text-2xl font-black italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Growing<br />Together
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          9. CTA BANNER
      ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="/about-cta-home.jpg"
          alt="Care for your home — KICK Home Care"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-[#1A1A1A]/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: CTA text */}
          <div className="text-white space-y-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Care for Your Home.<br />
              <span className="text-[#D0161D]">Care for Your Life.</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
              Choose KICK Home Care for a cleaner, healthier and happier home — because you deserve the best.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-7 py-3.5 bg-[#D0161D] hover:bg-red-800 text-white font-black text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Kick product images collage */}
          <div className="flex items-center justify-center gap-4">
            <img src="/Shoe Care.png" alt="Kick Shoe Care" className="h-24 sm:h-32 object-contain drop-shadow-2xl" />
            <img src="/laundry Care.png" alt="Kick Laundry Care" className="h-28 sm:h-36 object-contain drop-shadow-2xl" />
            <img src="/dish care.png" alt="Kick Dish Care" className="h-24 sm:h-32 object-contain drop-shadow-2xl" />
            <img src="/mosquito protection.png" alt="Kick Mosquito" className="h-20 sm:h-28 object-contain drop-shadow-2xl" />
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
