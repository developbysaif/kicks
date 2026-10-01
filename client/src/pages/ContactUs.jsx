import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  Tag,
  Headphones,
  Package,
  RotateCcw,
  Zap,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import API from '../services/api';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      const { data } = await API.post('/contact', {
        name,
        email,
        phone,
        subject,
        message
      });
      if (data.success) {
        setStatusMsg(data.message || 'Thank you! Your message has been sent successfully.');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setStatusMsg(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setStatusMsg(err.response?.data?.message || 'Thank you! Your message has been recorded.');
      if (err.response?.data?.success) {
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-16 w-full">
        
        {/* 2. SEND US A MESSAGE FORM + 4 DIRECT CONTACT CARDS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
            
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5" />
                <span>GET IN TOUCH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {statusMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-4 rounded-2xl border border-emerald-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50 text-slate-800 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50 text-slate-800 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50 text-slate-800 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50 text-slate-800 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-400"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Information">Product Information</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Returns & Refunds">Returns & Refunds</option>
                      <option value="Wholesale Order">Wholesale Order</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message here.."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 text-slate-800 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>

            </form>

          </div>

          {/* Right Column: 4 Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Customer Support */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Customer Support</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Our support team is available 24/7 to help you with any queries.
                </p>
                <div className="pt-2 space-y-1 text-xs">
                  <a href="tel:+923001234567" className="font-bold text-red-600 flex items-center space-x-1.5 hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+92 300 1234567</span>
                  </a>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Mon - Sun, 9:00 AM - 10:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Email Us */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Email Us</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Send us an email and we'll get back to you as soon as possible.
                </p>
                <div className="pt-2 space-y-1 text-xs">
                  <a href="mailto:info@kickhomecare.com" className="font-bold text-red-600 flex items-center space-x-1.5 hover:underline">
                    <Mail className="w-3.5 h-3.5" />
                    <span>info@kickhomecare.com</span>
                  </a>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    We usually reply within 24 hours.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Call Us */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Call Us</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Talk to our friendly team for instant support.
                </p>
                <div className="pt-2 space-y-1 text-xs">
                  <a href="tel:+923001234567" className="font-bold text-red-600 flex items-center space-x-1.5 hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+92 300 1234567</span>
                  </a>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Mon - Sun, 9:00 AM - 10:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Visit Us */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Visit Us</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Our office is located in Lahore, Pakistan.
                </p>
                <div className="pt-2 text-xs font-bold text-slate-700 flex items-start space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>123 Main Street, Lahore, Pakistan</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* 3. HOW CAN WE HELP? (WE'RE HERE FOR YOU) */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-4 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              <span>HOW CAN WE HELP?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              We're Here for You
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your satisfaction is our priority. Here are some common ways we can assist you.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <Link
              to="/track-order"
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all group flex flex-col items-center justify-between min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Order Support</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Track your order & status.</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform mt-2">
                →
              </span>
            </Link>

            <Link
              to="/shop"
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all group flex flex-col items-center justify-between min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Product Info</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Learn more about products.</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform mt-2">
                →
              </span>
            </Link>

            <Link
              to="/refund-policy"
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all group flex flex-col items-center justify-between min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Returns & Policy</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Returns & complaints.</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform mt-2">
                →
              </span>
            </Link>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-between min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Fast Response</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Replies within 24h.</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold mt-2">
                →
              </span>
            </div>

          </div>

        </section>

        {/* 4. NEWSLETTER BANNER */}
        <section className="relative rounded-3xl overflow-hidden min-h-[180px] sm:min-h-[200px] flex items-center bg-white border border-slate-100 shadow-sm">
          <img
            src="/img4.jpeg"
            alt="Subscribe to Our Newsletter"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Mail className="w-6 h-6" />
            </div>

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

      </main>

    </div>
  );
};

export default ContactUs;
