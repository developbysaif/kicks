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
  ChevronRight,
  CircleChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CATEGORIES_DATA = [
  {
    name: 'Shoe Care',
    slug: 'shoe-care',
    count: '12 Products',
    image: '/Shoe Care.png',
    href: '/category/shoe-care'
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
    <div className="min-h-screen bg-[#f7f7f2] text-slate-800 font-sans">
      <Header />

      <main className="max-w-[1280px] mx-auto bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.02)]">
        <section className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D0161D]" />
            <span>About Kick Home Care</span>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr] gap-8 items-center">
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] leading-[0.95] font-black text-[#111111] tracking-[-0.06em]">
                About <span className="text-[#D0161D]">KICK</span>
                <br />
                Home Care
              </h1>

              <div className="flex items-center gap-2">
                <span className="h-1 w-12 bg-[#D0161D] rounded-full" />
                <span className="h-1 w-5 bg-[#D0161D]/40 rounded-full" />
              </div>

              <p className="max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
                Trusted home care products for a cleaner, healthier and happier home — because your home deserves the best.
              </p>
            </div>

            <div className="relative rounded-[28px] overflow-hidden border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] min-h-[260px]">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-red-50" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-emerald-50/80 to-transparent" />

              <div className="relative flex items-end justify-center h-full px-4 pb-3 pt-8 gap-3 sm:gap-5">
                <img src="/Shoe Care.png" alt="Shoe Care" className="h-28 sm:h-36 object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.18)] translate-y-2" />
                <img src="/laundry Care.png" alt="Laundry Care" className="h-32 sm:h-44 object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.18)]" />
                <img src="/dish care.png" alt="Dish Care" className="h-28 sm:h-36 object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.18)] translate-y-1" />
                <img src="/mosquito protection.png" alt="Mosquito Protection" className="h-24 sm:h-32 object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.18)]" />
              </div>

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-[20px] px-4 py-3 shadow-md text-center">
                <p className="text-[10px] font-black uppercase text-[#D0161D] tracking-[0.12em] leading-[1.5]">
                  Clean
                  <br />
                  Fresh
                  <br />
                  Safe
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-[#D0161D]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D0161D]">Who We Are</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Who We Are</h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                KICK Home Care is a proud Pakistani brand that brings you high-quality home care products designed for everyday life.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We specialize in practical, reliable and effective cleaning and care solutions that help you maintain a cleaner home, healthier living and a brighter tomorrow. From your shoes to your kitchen, bathroom to your surroundings — KICK has you covered.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#D0161D] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-800"
              >
                <span>Our Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative rounded-[28px] overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <img
                src="/about-who-we-are.jpg"
                alt="Pakistani family enjoying a clean home with KICK Home Care products"
                className="w-full h-[320px] sm:h-[380px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-6">
                <p className="font-black italic text-2xl sm:text-3xl leading-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                  Cleaner
                  <br />
                  Homes
                  <br />
                  Happier Lives
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_1.08fr] gap-8 md:gap-12 items-center">
            <div className="relative rounded-[28px] overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)] order-2 lg:order-1">
              <img
                src="/about-brand-story.jpg"
                alt="KICK Home Care — A Brand Born from Care"
                className="w-full h-[320px] sm:h-[380px] object-cover"
              />
              <div className="absolute top-4 left-4 rounded-[20px] bg-white/90 px-4 py-3 shadow-md border border-slate-200 text-center">
                <p className="text-[#D0161D] text-sm font-black italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  A Brand
                  <br />
                  Born from
                  <br />
                  <span className="text-[#111111] not-italic">Care</span>
                </p>
              </div>
            </div>

            <div className="space-y-5 order-1 lg:order-2">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-[#D0161D]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D0161D]">Our Story</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Our Brand Story</h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                KICK Home Care started with a simple belief — that every home deserves products that work, are safe and make life easier.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                What began as a commitment to quality and care has grown into a trusted name across Pakistan, helping millions of households keep their homes clean, fresh and well cared for.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#D0161D]/10">
                <Target className="h-6 w-6 text-[#D0161D]" />
              </div>
              <h3 className="text-xl font-black text-[#111111]">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                To provide high-quality, safe and affordable home care products that make everyday life cleaner, healthier and more convenient for every household in Pakistan.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#D0161D]/10">
                <Eye className="h-6 w-6 text-[#D0161D]" />
              </div>
              <h3 className="text-xl font-black text-[#111111]">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                To be the most trusted and loved home care brand in Pakistan, known for quality, innovation and care — today and for generations to come.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 bg-[#D0161D]" />
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D0161D]">Our Promise</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Why Choose KICK</h2>
            <p className="mt-2 text-sm text-slate-500">
              We care about your home, your family and your peace of mind. That's why millions of households trust KICK.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {WHY_CHOOSE.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="rounded-[26px] border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition-all">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D0161D]/10">
                    <Icon className="h-7 w-7 text-[#D0161D]" />
                  </div>
                  <h4 className="text-sm font-black text-[#111111]">{item.title}</h4>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-[#D0161D]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D0161D]">Different Needs, One Trusted Brand</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Our Product Categories</h2>
            </div>

            <Link href="/shop" className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#D0161D] hover:underline">
              <span>Explore All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group rounded-[24px] border border-slate-200 bg-white p-4 text-center transition-all hover:border-[#D0161D]/40 hover:shadow-md"
              >
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-[18px] bg-slate-50 p-2">
                  <img src={cat.image} alt={cat.name} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-black text-[#111111] group-hover:text-[#D0161D] transition-colors">{cat.name}</h4>
                  <p className="mt-1 text-[10px] text-slate-400">{cat.count}</p>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-[#D0161D]">
                  <span>Shop</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Link href="/shop" className="flex items-center gap-1 text-xs font-bold text-[#D0161D] hover:underline">
              <span>Explore All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative rounded-[28px] overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <img src="/about-quality-trust.jpg" alt="KICK Home Care Quality Testing" className="h-[300px] sm:h-[360px] w-full object-cover" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-8 bg-[#D0161D]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D0161D]">Our Standards</span>
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Quality You Can Trust</h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Every KICK product is made with carefully selected ingredients and goes through strict quality checks to ensure it delivers the best results, every time.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {QUALITY_ICONS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D0161D]/10">
                        <Icon className="h-4 w-4 text-[#D0161D]" />
                      </div>
                      <span className="text-xs font-black text-[#111111]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-200">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 bg-[#D0161D]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D0161D]">A growing family trusted across Pakistan</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Our Journey in Numbers</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <p className="text-4xl sm:text-5xl font-black text-[#D0161D]">5+</p>
              <p className="mt-2 text-sm font-bold text-[#111111]">Product Categories</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <p className="text-4xl sm:text-5xl font-black text-[#D0161D]">1M+</p>
              <p className="mt-2 text-sm font-bold text-[#111111]">Happy Households</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <p className="text-4xl sm:text-5xl font-black text-[#D0161D]">10+</p>
              <p className="mt-2 text-sm font-bold text-[#111111]">Years of Trust</p>
            </div>

            <div className="rounded-[28px] bg-[#D0161D] p-7 text-center text-white shadow-lg">
              <Sparkles className="mx-auto mb-3 h-9 w-9 text-white/80" />
              <p className="text-xl sm:text-2xl font-black italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Growing
                <br />
                Together
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <img src="/about-cta-home.jpg" alt="Care for your home — KICK Home Care" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-[#1A1A1A]/30" />

          <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5 text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-[52px] leading-[0.98] font-black tracking-[-0.06em]">
                Care for Your Home.
                <br />
                <span className="text-[#D0161D]">Care for Your Life.</span>
              </h2>

              <p className="max-w-md text-sm sm:text-base text-white/80 leading-relaxed">
                Choose KICK Home Care for a cleaner, healthier and happier home — because you deserve the best.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#D0161D] px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-red-800"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <img src="/Shoe Care.png" alt="Kick Shoe Care" className="h-20 sm:h-28 object-contain drop-shadow-[0_16px_25px_rgba(0,0,0,0.3)]" />
              <img src="/laundry Care.png" alt="Kick Laundry Care" className="h-24 sm:h-32 object-contain drop-shadow-[0_16px_25px_rgba(0,0,0,0.3)]" />
              <img src="/dish care.png" alt="Kick Dish Care" className="h-20 sm:h-28 object-contain drop-shadow-[0_16px_25px_rgba(0,0,0,0.3)]" />
              <img src="/mosquito protection.png" alt="Kick Mosquito" className="h-18 sm:h-24 object-contain drop-shadow-[0_16px_25px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
