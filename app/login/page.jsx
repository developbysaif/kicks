'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    let res;
    if (isRegister) {
      res = await register(name, email, password, phone);
    } else {
      res = await login(email, password);
    }

    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setErrorMsg(res.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Ambient background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0,transparent_100%)] pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-7 sm:p-10 border border-slate-800/80 shadow-2xl shadow-black/80 space-y-6 relative z-10">
        
        {/* Back to Home & Logo Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>

          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-red-500" />
            <span>KICKS</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30 font-black text-2xl tracking-tighter">
            K
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            {isRegister
              ? 'Join Kicks to enjoy fast checkout, order tracking & exclusive deals.'
              : 'Sign in to access your orders, wishlist, and profile.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold p-3.5 rounded-2xl flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Register Only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-slate-950/70 border border-slate-800 text-white text-xs rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-slate-950/70 border border-slate-800 text-white text-xs rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Phone Number (Register Only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-slate-950/70 border border-slate-800 text-white text-xs rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Password <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-10 bg-slate-950/70 border border-slate-800 text-white text-xs rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider flex items-center justify-center space-x-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Toggle Register / Sign In */}
        <div className="text-center border-t border-slate-800/60 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
          >
            {isRegister ? (
              <span>
                Already have an account? <strong className="text-red-500 underline underline-offset-4">Sign In</strong>
              </span>
            ) : (
              <span>
                Don't have an account? <strong className="text-red-500 underline underline-offset-4">Create One</strong>
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Security Footer Note */}
      <p className="text-[11px] text-slate-600 mt-6 text-center font-medium">
        &copy; {new Date().getFullYear()} Kicks Home Care. Safe & Encrypted Connection.
      </p>

    </div>
  );
}

