'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Shield,
  ShieldCheck,
  Lock,
  FileText,
  Truck,
  CreditCard,
  Cookie,
  Megaphone,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SECTIONS = [
  { id: 'section-1', title: '1. Information We Collect', icon: FileText },
  { id: 'section-2', title: '2. How We Use Information', icon: UserCheck },
  { id: 'section-3', title: '3. Order & Delivery Info', icon: Truck },
  { id: 'section-4', title: '4. Payment Information', icon: CreditCard },
  { id: 'section-5', title: '5. Cookies & Technologies', icon: Cookie },
  { id: 'section-6', title: '6. Marketing & Advertising', icon: Megaphone },
  { id: 'section-7', title: '7. Data Security', icon: Lock },
  { id: 'section-8', title: '8. Third-Party Services', icon: ExternalLink },
  { id: 'section-9', title: "9. Children's Privacy", icon: Baby },
  { id: 'section-10', title: '10. Your Rights & Choices', icon: ShieldCheck },
  { id: 'section-11', title: '11. Changes to This Policy', icon: RefreshCw },
  { id: 'section-12', title: '12. Contact Us', icon: Mail }
];

export default function PrivacyPolicyPage() {
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
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-red-400">Privacy Policy</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>LEGAL & COMPLIANCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Kick Home Care respects your privacy and is committed to protecting the personal information you share with us when you visit our website, place an order, contact our support team, or interact with our services.
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

              {/* Need Help Card in Sidebar */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0B1D33] text-white space-y-2">
                  <div className="flex items-center space-x-1.5 text-red-400 text-xs font-black">
                    <ShieldCheck className="w-4 h-4" />
                    <span>YOUR PRIVACY MATTERS</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Have questions about how your personal data is handled? Reach out anytime.
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
                <h3 className="text-sm font-black text-amber-950">Agreement to Terms</h3>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                  By using the Kick Home Care website, you agree to the practices described in this Privacy Policy. Please read this policy carefully before submitting any personal information.
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
                    1. Information We Collect
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">What data is gathered during your visits and purchases</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>We may collect personal information including:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[
                    'Full name',
                    'Phone number',
                    'Email address',
                    'Delivery address',
                    'Billing information',
                    'Order details',
                    'Customer support messages',
                    'Website usage information',
                    'Device, browser, and IP-related information',
                    'Information submitted via forms, WhatsApp, or social media'
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <strong>Principle of Minimization:</strong> We only collect information that is reasonably required to process orders, provide support, improve our services, and communicate with customers.
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
                    2. How We Use Your Information
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Purposes and operational grounds for data processing</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>Your information may be used to:</p>
                <ul className="space-y-2">
                  {[
                    'Process and confirm your orders',
                    'Arrange delivery through courier partners',
                    'Contact you regarding your order',
                    'Provide customer support',
                    'Respond to inquiries and complaints',
                    'Improve our website and services',
                    'Prevent fraud, misuse, or suspicious activity',
                    'Send promotional offers, product updates, or marketing messages where permitted',
                    'Maintain internal business and transaction records'
                  ].map((purpose, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2"></span>
                      <span>{purpose}</span>
                    </li>
                  ))}
                </ul>
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
                    3. Order and Delivery Information
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Logistics fulfillment & courier partner sharing</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  To complete your order, we may share necessary information such as your name, phone number, address, and order details with delivery and logistics partners, including courier service providers such as <strong>TCS</strong>, <strong>PostEx</strong>, or other delivery partners used by Kick Home Care.
                </p>

                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 text-xs text-red-900 font-medium flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strictly Necessary Sharing:</strong> Only the exact information necessary to safely fulfill and deliver your package to your doorstep is provided to authorized logistics operators.
                  </span>
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
                    4. Payment Information
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Financial security & gateway processing</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Where online payment options are available, payments may be processed through third-party payment gateways, banks, or financial service providers.
                </p>
                <p>
                  Kick Home Care does not directly store complete banking credentials, card numbers, or sensitive PINs where transactions are handled securely by third-party licensed payment providers.
                </p>
                <p className="text-slate-500 italic text-xs">
                  Customers are responsible for ensuring that all payment information provided is accurate and authentic.
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
                    5. Cookies and Website Technologies
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Tracking, preferences, and session optimization</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>Our website may use cookies and similar technologies to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Remember user preferences & cart items',
                    'Improve website performance & speeds',
                    'Understand visitor activity and traffic paths',
                    'Measure marketing campaign effectiveness',
                    'Improve the overall shopping experience',
                    'Display relevant product suggestions'
                  ].map((cookieUse, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
                      <Cookie className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{cookieUse}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  You may control or disable cookies through your browser settings. However, note that some features (such as persistent shopping cart sessions) may not function correctly if cookies are fully disabled.
                </p>
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
                    6. Marketing and Advertising
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Promotional campaigns & advertising partners</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Kick Home Care may use advertising and analytics services provided by third-party platforms such as <strong>Meta (Facebook & Instagram)</strong>, <strong>Google</strong>, <strong>TikTok</strong>, or similar platforms. These platforms may collect limited technical or browsing information according to their own privacy policies.
                </p>
                <p>
                  You may receive promotional communications from Kick Home Care if you have interacted with us, placed an order, subscribed to updates, or otherwise provided permission where required.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                  🔔 <strong>Opt-Out Right:</strong> You may request to stop receiving promotional communications at any time by clicking unsubscribe links or messaging our customer care team.
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
                    7. Data Security
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Protecting your information from unauthorized access</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  We take reasonable administrative, technical, and physical measures to protect customer information against unauthorized access, misuse, loss, alteration, or disclosure.
                </p>
                <div className="p-4 rounded-2xl bg-slate-100/70 text-slate-600 text-xs border border-slate-200">
                  <em>Disclaimer:</em> While we implement modern security standards and SSL encryption across our entire platform, no method of transmission over the internet or electronic storage system can be guaranteed to be 100% invulnerable.
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
                    8. Third-Party Services
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">External sites, payment gateways, and social channels</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Our website may contain links to third-party websites, payment providers, social media platforms, courier services, or other external services.
                </p>
                <p>
                  Kick Home Care is not responsible for the privacy practices, content, or security policies of third-party websites or services. We encourage customers to review the privacy policies of any external service they visit.
                </p>
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
                    9. Children’s Privacy
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Age restrictions and household consumer intent</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Our products and website are intended for general household consumers and adults purchasing cleaning and care solutions.
                </p>
                <p>
                  We do not knowingly collect personal information from children where such collection would be inappropriate or unlawful under local regulations.
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
                    10. Your Information & Rights
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Access, updates, corrections, and data removal</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>You may contact Kick Home Care at any time if you wish to:</p>
                <div className="space-y-2">
                  {[
                    'Request information about personal data provided to us',
                    'Correct inaccurate or outdated personal details',
                    'Update your contact or delivery details',
                    'Request removal of information where legally and operationally possible',
                    'Stop promotional notifications or email marketing'
                  ].map((right, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{right}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  <em>Note:</em> Certain transaction information must be retained for legitimate business records, tax/accounting purposes, fraud prevention, or legal obligations.
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
                    11. Changes to This Privacy Policy
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Revisions and ongoing updates</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Kick Home Care may update this Privacy Policy from time to time to reflect operational, legal, or regulatory modifications.
                </p>
                <p>
                  Any updated version will be posted on our website with the revised effective or last updated date. Continued use of the website after any update signifies your acceptance of the revised Privacy Policy.
                </p>
              </div>
            </section>

            {/* SECTION 12 */}
            <section
              id="section-12"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-red-200/80 shadow-sm space-y-6 scroll-mt-28 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  12
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    12. Contact Us
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Official communication channels for privacy queries</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  If you have any questions or concerns regarding this Privacy Policy or your data handling, please contact Kick Home Care through our official channels:
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

      {/* SECTION 3 (RED) -> Assistance & Privacy Queries Callout */}
      <section className="bg-[#D0161D] text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">
                Support &amp; Inquiries
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Have questions regarding your personal data?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
                Our support team is ready to assist you with data requests, account deletion, or order privacy questions.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-[#D0161D] hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition"
              >
                Contact Support
              </Link>
              <a
                href="mailto:info@kickhomecare.com"
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Email Privacy Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
