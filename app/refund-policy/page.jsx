'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  RotateCcw,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  Camera,
  PackageX,
  Truck,
  CreditCard,
  Clock,
  Building2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Video,
  Banknote,
  Send
} from 'lucide-react';

const SECTIONS = [
  { id: 'section-1', title: '1. Eligible Return Cases', icon: PackageCheck },
  { id: 'section-2', title: '2. Reporting an Issue', icon: Camera },
  { id: 'section-3', title: '3. Condition of Returns', icon: CheckCircle2 },
  { id: 'section-4', title: '4. Change of Mind Policy', icon: PackageX },
  { id: 'section-5', title: '5. Damaged Products', icon: AlertCircle },
  { id: 'section-6', title: '6. Incorrect Products', icon: RotateCcw },
  { id: 'section-7', title: '7. Missing Items', icon: Truck },
  { id: 'section-8', title: '8. Refund Methods & Timelines', icon: Banknote },
  { id: 'section-9', title: '9. Return Shipping Costs', icon: CreditCard },
  { id: 'section-10', title: '10. Contact Us for Returns', icon: Mail }
];

export default function RefundPolicyPage() {
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
            <span className="text-red-400">Refund & Return Policy</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[11px] font-black uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETURNS & GUARANTEE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Refund & Return Policy
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At Kick Home Care, customer satisfaction is important to us. We take reasonable care when preparing and dispatching orders and aim to ensure that customers receive the correct products in good condition.
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

              {/* Need Immediate Help Card */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0B1D33] text-white space-y-2">
                  <div className="flex items-center space-x-1.5 text-red-400 text-xs font-black">
                    <ShieldCheck className="w-4 h-4" />
                    <span>HASSLE-FREE RETURNS</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Received a damaged or incorrect package? Contact us on WhatsApp for fast verification.
                  </p>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white hover:text-red-400 transition-colors pt-1"
                  >
                    <span>Message WhatsApp Support</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENT SECTIONS */}
          <div className="lg:col-span-8 space-y-8">

            {/* PREAMBLE NOTICE */}
            <div className="bg-red-50/70 border border-red-100 rounded-3xl p-6 sm:p-8 flex items-start space-x-4">
              <RotateCcw className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-red-950">Our Commitment to You</h3>
                <p className="text-xs sm:text-sm text-red-900/90 leading-relaxed font-medium">
                  This Refund & Return Policy explains when a product qualifies for replacement, return, or refund. We ensure fair and transparent resolutions for every genuine concern.
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
                    1. Eligible Return or Replacement Cases
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Circumstances that qualify for claims</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>You may contact us for immediate assistance if:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[
                    'You received the wrong product',
                    'The product received is physically damaged',
                    'The product is leaking due to damaged packaging',
                    'The product formulation is defective or faulty',
                    'An item is missing from your confirmed order',
                    'The quantity received does not match the confirmed order'
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong>Review Process:</strong> All replacement and return requests are evaluated by our quality control and customer support team before authorization.
                </div>
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
                    2. Reporting an Issue
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">How and when to notify our team</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Customers should report damaged, incorrect, defective, or missing products as soon as possible after receiving the parcel (ideally within 24–48 hours).
                </p>

                <p className="font-bold text-slate-800">For faster verification, please have the following ready:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Order number & invoice details',
                    'Customer full name and registered phone',
                    'Clear photos of the outer courier flyer/box',
                    'Clear photos of the product and its barcode',
                    'Photos showing any leakage or damaged seal',
                    'A short unboxing video (where required)'
                  ].map((req, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700 font-medium">
                      <Camera className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
                  <Video className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pro-Tip (Unboxing Video):</strong> We strongly recommend recording a continuous unboxing video when opening your parcel, especially for multiple-item orders. This significantly accelerates the claim verification process with our logistics partners.
                  </div>
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
                    3. Condition of Returned Products
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Requirements for accepted physical returns</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>Where a physical product return is approved by Kick Home Care, the item must normally be:</p>

                <ul className="space-y-2">
                  {[
                    'Unused and unconsumed',
                    'In its original packaging, box, or shrink-wrap',
                    'In resalable condition with original cap, nozzle, or seal intact',
                    'Returned with all accessories, applicators, brushes, or components included'
                  ].map((cond, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2"></span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-900 font-medium">
                  Products that have been substantially used, altered, intentionally damaged, or improperly stored after delivery do not qualify for returns or refunds.
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
                    4. Change of Mind
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Policy on hygiene, chemicals, and accidental orders</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Due to hygiene, chemical safety, and tamper-prevention regulations, returns based solely on change of mind cannot be accepted for opened, unsealed, or used household cleaning formulations, liquids, hygiene sprays, insect-control repellents, or laundry supplies.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-slate-900">Accidental Orders:</div>
                  <p>
                    If you accidentally ordered the wrong variant or item, please contact our support team immediately. If your order has not yet been processed or dispatched by our warehouse, we will gladly update or cancel it without any penalty.
                  </p>
                </div>
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
                    5. Damaged Products
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Resolutions for in-transit damages</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  If you receive a product that was damaged or leaked during transit, please contact us promptly with clear photographic or video evidence.
                </p>

                <p className="font-bold text-slate-800">Once verified by our team, we will offer:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    { title: 'Immediate Replacement', desc: 'Free replacement of the damaged bottle or component.' },
                    { title: 'Order Reshipment', desc: 'Complete parcel reshipment where damage affects the full order.' },
                    { title: 'Store Credit Voucher', desc: 'Instant store credit coupon for your next purchase.' },
                    { title: 'Full or Partial Refund', desc: 'Reimbursement to your bank/wallet depending on circumstances.' }
                  ].map((res, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="font-bold text-slate-900">{res.title}</div>
                      <div className="text-slate-500">{res.desc}</div>
                    </div>
                  ))}
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
                    6. Incorrect Products
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Dispatch errors and product discrepancies</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  If Kick Home Care sends you an item different from the specific product or size confirmed in your invoice, please contact us immediately.
                </p>
                <p>
                  Following rapid verification, we will arrange prompt dispatch of the correct product at zero additional cost to you, and advise on whether the incorrect item should be handed to the courier.
                </p>
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
                    7. Missing Items
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Short shipments and partial package deliveries</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  If an item is missing from your delivered parcel, please notify our customer support team within <strong>48 hours</strong> of receipt with your invoice and photos of the package content.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                  <div className="font-bold text-slate-900">Resolution Options for Missing Items:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    <li>Immediate express dispatch of the missing product at no shipping charge</li>
                    <li>Or a refund / store credit corresponding to the value of the missing product</li>
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
                    8. Refund Methods and Timelines
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">How and when reimbursement is delivered</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>Where a monetary refund is authorized:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD) Orders</span>
                    </div>
                    <p className="text-slate-600">
                      Refunds are transferred via online bank transfer, EasyPaisa, or JazzCash to the verified customer account.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <CreditCard className="w-4 h-4 text-red-600" />
                      <span>Card / Prepaid Orders</span>
                    </div>
                    <p className="text-slate-600">
                      Reimbursements are reversed to the original card or payment account used during checkout.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium">
                  ⏱️ <strong>Processing Timeline:</strong> Approved refunds are usually processed within <strong>5 to 7 business days</strong> following completion of inspection and verification.
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
                    9. Return Shipping Costs
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Courier fee responsibilities</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950">
                    <strong>Defective or Damaged Products:</strong> If the replacement or return is due to an error on our part (damaged bottle, defect, or wrong item shipped), Kick Home Care will bear the shipping cost or arrange free reverse courier pickup.
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong>Other Approved Returns:</strong> For any other customer-initiated return, the customer is responsible for securely packaging and dispatching the product to our designated facility in Lahore.
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 10 */}
            <section
              id="section-10"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-red-200/80 shadow-sm space-y-6 scroll-mt-28 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  10
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    10. Contact Us for Returns & Refunds
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">How to initiate a claim</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  To request a return, replacement, or refund, please reach out to our dedicated support representatives:
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
                      <Send className="w-4 h-4" />
                      <span>Submit a Claim on Contact Form</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>

      {/* SECTION 3 (RED) -> Hassle-Free Returns Assurance Callout */}
      <section className="bg-[#D0161D] text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">
                Kick Guarantee
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Received a damaged or incorrect order?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
                We guarantee speedy claim resolution. Send us your order ID and unboxing photo or video, and our team will resolve it within 24–48 hours.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-[#D0161D] hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition"
              >
                File Return Claim
              </Link>
              <a
                href="mailto:info@kickhomecare.com"
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Email Support Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
