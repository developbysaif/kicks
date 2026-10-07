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
  CircleChevronRight,
  FlaskConical
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSection from '@/components/PageSection';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickhomecare.com';

export const metadata = {
  title: 'About Us | Kick Home Care - A Project of Ibn Khushi',
  description:
    'Learn about Kick Home Care, an innovative Pakistani brand under Ibn Khushi delivering trusted shoe care, household cleaning, bleach, and hygiene solutions.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About Us | Kick Home Care - A Project of Ibn Khushi',
    description:
      'Learn about Kick Home Care, an innovative Pakistani brand under Ibn Khushi delivering trusted shoe care and household cleaning.',
    url: `${SITE_URL}/about`,
    siteName: 'Kick Home Care',
    type: 'website',
    images: [
      {
        url: '/kick%20logo.png',
        width: 1200,
        height: 630,
        alt: 'About Kick Home Care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Kick Home Care',
    description:
      'Learn about Kick Home Care, an innovative Pakistani brand under Ibn Khushi delivering trusted shoe care and household cleaning.',
    images: ['/kick%20logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${SITE_URL}/about`,
      url: `${SITE_URL}/about`,
      name: 'About Kick Home Care',
      description:
        'Kick Home Care is a pioneering manufacturer of premium household cleaning, laundry care, and shoe restoration products in Pakistan.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Kick Home Care',
        url: SITE_URL,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About Us',
          item: `${SITE_URL}/about`,
        },
      ],
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="w-full flex-1">
        {/* 1. HERO BANNER SECTION — WHITE */}
        <section className="relative w-full overflow-hidden bg-white border-b border-slate-200">
          
          {/* Top center accent red notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#D0161D] rounded-b-full z-30" />

          {/* Top-left decorative ribbon swirl */}
          <div className="absolute top-0 left-0 w-24 sm:w-32 lg:w-40 h-28 sm:h-36 lg:h-44 pointer-events-none z-20 overflow-hidden">
            <svg viewBox="0 0 140 140" fill="none" className="w-full h-full">
              <path d="M -10 -10 C 65 25 85 85 -10 135 Z" fill="#D0161D" />
              <path d="M -10 -10 C 45 18 60 70 -10 105 Z" fill="#15803d" />
            </svg>
          </div>

          {/* Bottom-left decorative ribbon swirl */}
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-36 pointer-events-none z-20 overflow-hidden">
            <svg viewBox="0 0 140 120" fill="none" className="w-full h-full">
              <path d="M -10 130 C 65 100 85 45 -10 -10 Z" fill="#D0161D" />
              <path d="M -10 130 C 45 105 60 60 -10 20 Z" fill="#15803d" />
            </svg>
          </div>

          {/* Desktop Panoramic Layout */}
          <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center">
            
            {/* Background Hero Image pinned to the right on desktop */}
            <div
              className="absolute inset-0 hidden lg:block bg-no-repeat bg-right bg-cover pointer-events-none"
              style={{
                backgroundImage: "url('/about-hero-banner.jpg')",
                backgroundPosition: "right center"
              }}
            />

            {/* Left fade to ensure text has pure white background and 100% legibility */}
            <div className="absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-white via-white via-80% to-transparent hidden lg:block pointer-events-none z-10" />

            {/* Top-right "Clean Fresh Safe" Script Calligraphy */}
            <div className="absolute top-5 sm:top-8 right-5 sm:right-10 lg:right-14 z-20 pointer-events-none text-center">
              <div className="inline-block transform -rotate-3 text-center">
                <span
                  className="block text-2xl sm:text-3xl lg:text-[38px] text-[#0F243E] font-black italic tracking-wide leading-[1.05]"
                  style={{ fontFamily: "'Dancing Script', 'Brush Script MT', 'Caveat', cursive, serif" }}
                >
                  Clean<br />
                  Fresh<br />
                  Safe
                </span>
                <svg className="w-20 sm:w-28 h-4 mx-auto text-[#D0161D] mt-1" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 5 12 Q 50 3 95 15" />
                </svg>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 lg:py-16 w-full">
              <div className="max-w-xl space-y-4 pl-4 sm:pl-8 lg:pl-12">

                {/* Pill Badge */}
                <div>
                  <span className="inline-block px-4 py-1.5 bg-[#D0161D] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-full shadow-xs">
                    ABOUT KICK HOME CARE
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#0F243E] tracking-tight leading-[1.06]">
                  About KICK<br />
                  Home Care
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal max-w-md">
                  Trusted home care products for a cleaner, healthier and happier home — because your home deserves the best.
                </p>

                {/* Red accent line bar */}
                <div className="pt-2">
                  <div className="w-14 h-1 bg-[#D0161D] rounded-full" />
                </div>

              </div>

              {/* Mobile / Tablet Image: Shown below text on screens smaller than lg */}
              <div className="mt-8 block lg:hidden rounded-2xl overflow-hidden shadow-md border border-slate-100 relative">
                <img
                  src="/about-hero-banner.jpg"
                  alt="About KICK Home Care products"
                  className="w-full h-auto object-cover"
                />
              </div>

            </div>

          </div>

        </section>

        {/* 2. WHO WE ARE SECTION — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-white" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Who We Are</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.04em]">Who We Are</h2>

              <p className="text-sm text-white/90 leading-relaxed font-medium">
                KICK Home Care is a proud Pakistani brand that brings you high-quality home care products designed for everyday life.
              </p>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                We specialize in practical, reliable and effective cleaning and care solutions that help you maintain a cleaner home, healthier living and a brighter tomorrow. From your shoes to your kitchen, bathroom to your surroundings — KICK has you covered.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black text-black transition hover:bg-black hover:text-white shadow-md w-fit"
              >
                <span>Our Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative rounded-[28px] overflow-hidden border border-white/20 shadow-2xl">
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
        </PageSection>

        {/* 3. OUR BRAND STORY — WHITE */}
        <PageSection variant="white">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_1.08fr] gap-8 md:gap-12 items-center">
            <div className="relative rounded-[28px] overflow-hidden border border-slate-200 shadow-md order-2 lg:order-1">
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

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                KICK Home Care started with a simple belief — that every home deserves products that work, are safe and make life easier.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                What began as a commitment to quality and care has grown into a trusted name across Pakistan, helping millions of households keep their homes clean, fresh and well cared for.
              </p>
            </div>
          </div>
        </PageSection>

        {/* 4. MISSION & VISION — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 bg-white" />
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Our Purpose</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-[-0.04em]">Mission & Vision</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-[28px] border border-white/20 bg-white p-7 shadow-xl hover:shadow-2xl transition-all">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#D0161D]">
                <Target className="h-6 w-6 text-[#D0161D]" />
              </div>
              <h3 className="text-xl font-black text-[#111111]">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 font-medium">
                To provide high-quality, safe and affordable home care products that make everyday life cleaner, healthier and more convenient for every household in Pakistan.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/20 bg-white p-7 shadow-xl hover:shadow-2xl transition-all">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#D0161D]">
                <Eye className="h-6 w-6 text-[#D0161D]" />
              </div>
              <h3 className="text-xl font-black text-[#111111]">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 font-medium">
                To be the most trusted and loved home care brand in Pakistan, known for quality, innovation and care — today and for generations to come.
              </p>
            </div>
          </div>
        </PageSection>

        {/* 5. WHY CHOOSE KICK — WHITE */}
        <PageSection variant="white">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 bg-[#D0161D]" />
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D0161D]">Our Promise</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.04em]">Why Choose KICK</h2>
            <p className="mt-2 text-sm text-slate-600 font-normal">
              We care about your home, your family and your peace of mind. That's why millions of households trust KICK.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {WHY_CHOOSE.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="rounded-[26px] border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition-all">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <Icon className="h-7 w-7 text-[#D0161D]" />
                  </div>
                  <h4 className="text-sm font-black text-[#111111]">{item.title}</h4>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600 font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </PageSection>

        {/* 6. OUR PRODUCT CATEGORIES — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-white" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Different Needs, One Trusted Brand</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-[-0.04em]">Our Product Categories</h2>
            </div>

            <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-black bg-white hover:bg-black hover:text-white px-5 py-2.5 rounded-full shadow-md transition-all">
              <span>Explore All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group rounded-3xl border border-white/30 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 mb-4 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-end justify-between pt-1">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-black group-hover:text-[#D0161D] transition-colors">
                      {cat.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      {cat.count}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#D0161D] group-hover:translate-x-1 transition-transform">
                    <span>Shop</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/shop" className="flex items-center gap-1 text-xs font-black text-black bg-white px-5 py-2.5 rounded-full shadow-md">
              <span>Explore All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </PageSection>

        {/* 7. QUALITY YOU CAN TRUST — WHITE */}
        <PageSection variant="white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#D0161D] rounded-full shrink-0" />
                <h3 className="text-xl sm:text-2xl font-black text-[#0F243E] tracking-tight">
                  Quality You Can Trust
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-3.5">
                Quality Kicks You Can Trust
              </p>

              <div className="mt-4 rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                <img
                  src="/about-quality-lab.jpg"
                  alt="Quality You Can Trust - Chemical Testing & Formulation Laboratory"
                  className="w-full h-[220px] sm:h-[250px] object-cover object-center hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 pt-1 lg:pt-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#D0161D] rounded-full shrink-0" />
                <h3 className="text-xl sm:text-2xl font-black text-[#0F243E] tracking-tight">
                  Quality You Can Trust
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl pl-3.5">
                Every KICK product is made with carefully selected ingredients and goes through strict quality checks to ensure it delivers the best results, every time.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center text-[#1E3A5F] shrink-0">
                    <Leaf className="w-5 h-5 text-[#1E3A5F]" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-bold text-[#0F243E]">Safe</span>
                    <span className="block text-[11px] text-slate-500 font-medium">Ingredients</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-4">
                  <div className="w-11 h-11 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center text-[#1E3A5F] shrink-0">
                    <FlaskConical className="w-5 h-5 text-[#1E3A5F]" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-bold text-[#0F243E]">Quality</span>
                    <span className="block text-[11px] text-slate-500 font-medium">Testing</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-4">
                  <div className="w-11 h-11 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center text-[#1E3A5F] shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#1E3A5F]" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-bold text-[#0F243E]">Long-Lasting</span>
                    <span className="block text-[11px] text-slate-500 font-medium">Performance</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-4">
                  <div className="w-11 h-11 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center text-[#1E3A5F] shrink-0">
                    <Users className="w-5 h-5 text-[#1E3A5F]" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-bold text-[#0F243E]">Family</span>
                    <span className="block text-[11px] text-slate-500 font-medium">Safe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 8. OUR JOURNEY IN NUMBERS — RED */}
        <PageSection variant="red" className="border-t border-b border-red-700/20">
          <div className="relative rounded-[24px] sm:rounded-[32px] border border-white/30 bg-white p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-center">
              <div className="md:col-span-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#D0161D] rounded-full shrink-0" />
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F243E] tracking-tight">
                    Our Journey in Numbers
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium pl-3.5">
                  A growing family, trusted across Pakistan.
                </p>
              </div>

              <div className="md:col-span-2 text-center md:border-l md:border-slate-200/90 md:px-4 py-1">
                <p className="text-3xl sm:text-4xl font-black text-[#0F243E] tracking-tight">5+</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Product Categories</p>
              </div>

              <div className="md:col-span-2 text-center md:border-l md:border-slate-200/90 md:px-4 py-1">
                <p className="text-3xl sm:text-4xl font-black text-[#0F243E] tracking-tight">1M+</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Happy Households</p>
              </div>

              <div className="md:col-span-2 text-center md:border-l md:border-slate-200/90 md:px-4 py-1">
                <p className="text-3xl sm:text-4xl font-black text-[#0F243E] tracking-tight">10+</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Years of Trust</p>
              </div>

              <div className="md:col-span-2 text-center md:border-l md:border-slate-200/90 md:pl-4 py-1 flex flex-col items-center justify-center">
                <div className="inline-block transform -rotate-2 text-center">
                  <span
                    className="block text-2xl sm:text-3xl text-[#0F243E] font-black italic leading-[1.05]"
                    style={{ fontFamily: "'Dancing Script', 'Brush Script MT', 'Caveat', cursive, serif" }}
                  >
                    Growing<br />Together
                  </span>
                  <svg className="w-16 sm:w-20 h-3.5 mx-auto text-[#D0161D] mt-0.5" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M 5 12 Q 50 3 95 14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 9. BOTTOM CTA BANNER — WHITE */}
        <PageSection variant="white">
          <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-slate-200/80 bg-white shadow-xl">
            <div
              className="absolute inset-0 hidden lg:block bg-no-repeat bg-right bg-cover pointer-events-none"
              style={{
                backgroundImage: "url('/about-cta-banner.jpg')",
                backgroundPosition: "right center"
              }}
            />
            <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] bg-gradient-to-r from-white via-white via-75% to-transparent hidden lg:block pointer-events-none z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20">
              <div className="max-w-md lg:max-w-lg space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-black text-[#0F243E] tracking-tight leading-[1.12]">
                  Care for Your Home.<br />
                  Care for Your Life.
                </h2>
                <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal max-w-sm">
                  Choose KICK Home Care for a cleaner, healthier and happier home — because you deserve the best.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#D0161D] hover:bg-red-800 text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg group"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 block lg:hidden rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative">
                <img
                  src="/about-cta-banner.jpg"
                  alt="Care for Your Home - KICK Home Care products"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </PageSection>
      </main>

      <Footer />
    </div>
  );
}
