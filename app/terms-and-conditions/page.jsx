'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FileText,
  Package,
  CheckCircle2,
  Coins,
  ShoppingCart,
  Truck,
  PackageCheck,
  Banknote,
  CreditCard,
  Tag,
  AlertTriangle,
  Copyright,
  Globe,
  Scale,
  ShieldCheck,
  ChevronRight,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';

const SECTIONS = [
  { id: 'section-1', title: '1. General Terms', icon: FileText },
  { id: 'section-2', title: '2. Product Information', icon: Package },
  { id: 'section-3', title: '3. Product Availability', icon: CheckCircle2 },
  { id: 'section-4', title: '4. Prices & Currency', icon: Coins },
  { id: 'section-5', title: '5. Orders & Placement', icon: ShoppingCart },
  { id: 'section-6', title: '6. Delivery & Couriers', icon: Truck },
  { id: 'section-7', title: '7. Receiving Your Order', icon: PackageCheck },
  { id: 'section-8', title: '8. Cash on Delivery (COD)', icon: Banknote },
  { id: 'section-9', title: '9. Online Payments', icon: CreditCard },
  { id: 'section-10', title: '10. Promotions & Discounts', icon: Tag },
  { id: 'section-11', title: '11. Product Usage & Safety', icon: AlertTriangle },
  { id: 'section-12', title: '12. Intellectual Property', icon: Copyright },
  { id: 'section-13', title: '13. Website Use & Conduct', icon: Globe },
  { id: 'section-14', title: '14. Governing Law & Contact', icon: Scale }
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState('section-1');

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-red-500 selection:text-white">
      <Header />

      {/* HERO BANNER */}
      <section className="relative bg-[#0B1D33] text-white py-14 sm:py-20 border-b border-slate-800 overflow-hidden">
        {/* Decorative lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-red-400">Terms & Conditions</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>TERMS OF SERVICE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Terms & Conditions
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome to Kick Home Care. These Terms & Conditions apply to your use of the Kick Home Care website and to purchases made through our website, social media channels, WhatsApp, or other official sales channels.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>Last Updated: <strong>October 2026</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-300" />
                <span>A Project of <strong>Ibn Khushi</strong>, Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE QUICK JUMP PILLS */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 overflow-x-auto no-scrollbar shadow-sm">
        <div className="flex items-center space-x-2 min-w-max">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSection === sec.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* DESKTOP STICKY SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  TABLE OF CONTENTS
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Click any section to jump directly
                </p>
              </div>

              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollTo(sec.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                        isActive
                          ? 'bg-red-50 text-red-600 font-black border border-red-100 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </nav>

              {/* Need Assistance Card in Sidebar */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0B1D33] text-white space-y-2">
                  <div className="flex items-center space-x-1.5 text-red-400 text-xs font-black">
                    <ShieldCheck className="w-4 h-4" />
                    <span>CUSTOMER PROTECTION</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Need clarification on order cancellation, returns, or payment safety?
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white hover:text-red-400 transition-colors pt-1"
                  >
                    <span>Contact Support Team</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENT SECTIONS */}
          <div className="lg:col-span-8 space-y-8">

            {/* PREAMBLE NOTICE */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-amber-950">Binding Agreement</h3>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                  By using our website, placing an order, or interacting with our official sales representatives on WhatsApp or social channels, you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions.
                </p>
              </div>
            </div>

            {/* SECTION 1 */}
            <section
              id="section-1"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  01
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    1. General Terms
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Scope of operations and service rights</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Kick Home Care provides household care, cleaning, shoe care, laundry care, washroom cleaning, insect protection, and related products across Pakistan.
                </p>
                <p>
                  We reserve the right to update, modify, discontinue, or change products, pricing, offers, website content, and policies without prior notice where appropriate.
                </p>
              </div>
            </section>

            {/* SECTION 2 */}
            <section
              id="section-2"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  02
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    2. Product Information
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Descriptions, visual representations & minor variations</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>We make reasonable efforts to ensure that:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[
                    'Product descriptions are accurate',
                    'Product images represent the actual product',
                    'Prices are displayed correctly',
                    'Product quantities and specifications are clearly stated'
                  ].map((info, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{info}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  However, slight variations in packaging, labels, colours, or presentation may occur due to manufacturing or packaging batch updates. Such minor aesthetic differences do not necessarily mean that the product is defective.
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section
              id="section-3"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  03
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    3. Product Availability
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Inventory changes & replacement procedures</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>All orders are subject to stock and product availability.</p>
                <p>If an ordered item becomes temporarily unavailable or out of stock, we may:</p>
                <ul className="space-y-2">
                  {[
                    'Contact the customer via phone or WhatsApp',
                    'Offer a suitable alternative product or bundle',
                    'Remove the unavailable item from the order',
                    'Cancel the affected order or specific item'
                  ].map((action, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2"></span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                  Where payment has already been made in advance, an applicable refund will be processed promptly according to our standard Refund Policy.
                </div>
              </div>
            </section>

            {/* SECTION 4 */}
            <section
              id="section-4"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  04
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    4. Prices
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Currency and pricing applicability</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  All prices displayed on our website are generally shown in <strong>Pakistani Rupees (PKR)</strong> unless expressly stated otherwise.
                </p>
                <p>
                  Prices may change without prior notice. The price applicable to an order will normally be the price displayed or confirmed at the time the order is successfully placed.
                </p>
              </div>
            </section>

            {/* SECTION 5 */}
            <section
              id="section-5"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  05
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    5. Orders
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Customer details & verification rights</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>Customers are responsible for providing accurate and verifiable information when placing an order, including:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Customer name', 'Phone number', 'Complete delivery address', 'City', 'Order details'].map((info, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{info}</span>
                    </div>
                  ))}
                </div>

                <p>
                  Kick Home Care reserves the right to contact customers via call or WhatsApp for order confirmation before dispatch.
                </p>

                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 text-xs text-red-950 space-y-2">
                  <div className="font-bold flex items-center space-x-1.5 text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Order Cancellation Grounds</span>
                  </div>
                  <p className="text-red-900/90 leading-relaxed">
                    We may cancel or reject orders where:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-red-900/90 pl-1">
                    <li>Customer information is incomplete or unverified</li>
                    <li>The delivery address cannot be confirmed or serviced by courier</li>
                    <li>Fraud, abuse, or misuse is reasonably suspected</li>
                    <li>Products become unavailable</li>
                    <li>Pricing or system technical errors occur</li>
                    <li>The customer repeatedly refuses confirmed deliveries</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 6 */}
            <section
              id="section-6"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  06
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    6. Delivery
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Nationwide courier operations & delivery timelines</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Kick Home Care delivers orders across Pakistan through available courier and logistics partners (including TCS, PostEx, etc.).
                </p>

                <p>Delivery times may vary depending on:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Customer location & urban vs. rural route',
                    'Courier hub operations',
                    'Public holidays & festivals',
                    'Weather conditions (heavy rains, fog)',
                    'Operational delays & transit routes',
                    'Remote-area service availability'
                  ].map((del, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <strong>Estimated Timelines:</strong> Any estimated delivery time is an estimate and not an absolute contractual guarantee. Kick Home Care makes every reasonable effort to ensure timely delivery but cannot be held responsible for transit delays caused by third-party courier companies or force majeure circumstances.
                </div>
              </div>
            </section>

            {/* SECTION 7 */}
            <section
              id="section-7"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  07
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    7. Receiving Your Order
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Parcel inspection & tamper evidence</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>Customers should check the parcel when received wherever possible.</p>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-800">
                    <PackageCheck className="w-4 h-4 shrink-0" />
                    <span>Damaged or Tampered Parcels</span>
                  </div>
                  <p className="text-amber-900/90 leading-relaxed">
                    If the parcel appears severely damaged, opened, or tampered with:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1">
                    <li>Immediately take photos or videos of the parcel before opening</li>
                    <li>Contact Kick Home Care support within 24 hours</li>
                    <li>Avoid accepting parcels that appear suspiciously altered unless advised otherwise by our support team</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 8 */}
            <section
              id="section-8"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  08
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    8. Cash on Delivery (COD)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Payment terms upon physical delivery</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Where Cash on Delivery is available, customers agree to pay the full applicable invoice amount to the courier rider upon delivery of the parcel.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  ⚠️ <strong>Repeated Refusal Policy:</strong> Repeated refusal or non-acceptance of confirmed Cash on Delivery orders without valid justification may result in account restrictions or requirement of advance payment for future orders.
                </div>
              </div>
            </section>

            {/* SECTION 9 */}
            <section
              id="section-9"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  09
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    9. Online Payments
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Digital gateways and banking transactions</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Where online payment options are enabled, customers must provide accurate and authorized payment information.
                </p>
                <p>
                  Kick Home Care is not responsible for payment delays, bank processing errors, gateway timeouts, or transaction issues caused by third-party financial institutions or digital wallets.
                </p>
              </div>
            </section>

            {/* SECTION 10 */}
            <section
              id="section-10"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  10
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    10. Promotions and Discounts
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Vouchers, bundle offers & coupon usage terms</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>Discounts, coupon codes, bundle offers, and promotional campaigns may be subject to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Expiry dates', 'Minimum purchase requirements', 'Product restrictions', 'Usage limits per customer', 'Stock availability'].map((cond, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700 font-medium">
                      <Tag className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Kick Home Care reserves the right to modify, alter, or terminate any promotion or discount code at any time without prior liability.
                </p>
              </div>
            </section>

            {/* SECTION 11 */}
            <section
              id="section-11"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  11
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    11. Product Usage & Safety
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Critical guidelines for chemical and cleaning formulations</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Customers must use products strictly according to the instructions and warnings printed on the product packaging.
                </p>
                <p>
                  Customers are responsible for checking whether a product is appropriate for the intended surface, material, fabric, leather, or item before widespread application.
                </p>

                <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-3">
                  <div className="font-bold text-amber-900 flex items-center space-x-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Important Chemical & Cleaning Safety Guidelines:</span>
                  </div>
                  <ul className="space-y-2 text-amber-900/90 pl-1">
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>Keep away from children:</strong> Always store cleaning supplies safely out of reach of infants, children, and pets.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>Avoid contact with eyes and skin:</strong> Wear gloves where instructed; rinse thoroughly with fresh water in case of accidental contact.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>Do not consume:</strong> All KICK formulations are for external household/surface application only. Seek medical attention if ingested.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>Do not mix chemicals:</strong> Never mix cleaning agents (e.g. bleach with ammonia or acids) unless specifically directed.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span>Follow all label directions, patch-test on inconspicuous areas, and observe safety warnings.</span>
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-slate-500 italic">
                  Kick Home Care is not responsible for any property damage, discoloration, or injury caused by misuse, incorrect application, or failure to observe product instructions.
                </p>
              </div>
            </section>

            {/* SECTION 12 */}
            <section
              id="section-12"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  12
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    12. Intellectual Property
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Trademarks, copyrights & proprietary assets</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>All website content, including:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Logos & Emblems',
                    'Product images',
                    'Descriptions',
                    'Brand names',
                    'Graphics & Badges',
                    'Website text',
                    'Marketing materials',
                    'Videos & Reels',
                    'Design elements'
                  ].map((asset, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700 font-semibold">
                      <Copyright className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{asset}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 pt-1">
                  are the property of or licensed to Kick Home Care and Ibn Khushi. Such content may not be copied, reproduced, distributed, scraped, or commercially exploited without prior written authorization.
                </p>
              </div>
            </section>

            {/* SECTION 13 */}
            <section
              id="section-13"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-28"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                  13
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    13. Website Use & Prohibited Conduct
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Acceptable use policy and technical restrictions</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>When accessing or using the Kick Home Care website, you expressly agree not to:</p>
                <ul className="space-y-2.5">
                  {[
                    'Attempt to damage, disrupt, overburden, or impair the website, API, or hosting infrastructure',
                    'Use automated crawlers, scrapers, bots, or data extraction scripts without express written consent',
                    'Attempt unauthorized access to our administrative backend, user accounts, or servers',
                    'Transmit, upload, or execute malicious software, viruses, malware, or destructive code',
                    'Engage in fraudulent transactions, fake orders, or identity misrepresentation',
                    'Violate any applicable local, provincial, or federal Pakistani commercial laws'
                  ].map((conduct, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{conduct}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* SECTION 14 */}
            <section
              id="section-14"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-red-200/80 shadow-sm space-y-6 scroll-mt-28 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  14
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    14. Governing Law & Contact Us
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Jurisdiction and customer care contact</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  These Terms & Conditions are governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>.
                </p>
                <p>
                  For any inquiries, order assistance, or clarification regarding these Terms & Conditions, please contact us:
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                  <div>
                    <h4 className="text-base font-black text-slate-900">Kick Home Care</h4>
                    <p className="text-xs font-bold text-red-600">A Project of Ibn Khushi</p>
                    <p className="text-xs text-slate-500">Pakistan</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <a
                      href="mailto:info@kickhomecare.com"
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-red-400 transition flex items-center space-x-2 text-slate-700 font-bold"
                    >
                      <Mail className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="truncate">info@kickhomecare.com</span>
                    </a>

                    <a
                      href="tel:+923001234567"
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-red-400 transition flex items-center space-x-2 text-slate-700 font-bold"
                    >
                      <Phone className="w-4 h-4 text-red-600 shrink-0" />
                      <span>+92 300 1234567</span>
                    </a>

                    <a
                      href="https://maps.app.goo.gl/YKeqSm5kSDWwqWbh7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-red-400 transition flex items-center space-x-2 text-slate-700 font-bold"
                    >
                      <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="truncate">Lahore Location ↗</span>
                    </a>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <Link
                      href="/contact"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Go to Contact Us Form</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
