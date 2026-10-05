'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, resendVerification } = useAuth();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);

  // Check URL query param for default tab (?tab=register)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' || tab === 'signup') {
      setAuthMode('signup');
    } else {
      setAuthMode('signin');
    }
  }, [searchParams]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    return strength;
  };
  const passStrength = getPasswordStrength(password);

  // Handle Sign In submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUnverifiedEmail('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      }, 700);
    } else if (res.requireVerification) {
      // User registered but email is unverified
      setUnverifiedEmail(res.email || email);
      setErrorMsg(res.message || 'Please verify your email before logging in.');
    } else {
      setErrorMsg(res.message || 'Authentication failed. Please check your credentials.');
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const res = await register(name, cleanEmail, password, phone);
    setLoading(false);

    if (res.success) {
      // Redirect to /verify-email?email=...&sent=true (Section 2 & 16)
      router.push(`/verify-email?email=${encodeURIComponent(cleanEmail)}&sent=true`);
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
  };

  // Handle Resend Verification from Login Alert
  const handleResendFromLogin = async () => {
    if (!unverifiedEmail || resending) return;
    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await resendVerification(unverifiedEmail);
      setResending(false);
      if (res.success) {
        router.push(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}&sent=true`);
      } else {
        setErrorMsg(res.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      setResending(false);
      setErrorMsg('Failed to send verification email. Please try again.');
    }
  };

  // Quick Demo fill buttons for easy testing
  const fillDemoAdmin = () => {
    setEmail('admin@kickhomecare.com');
    setPassword('admin123');
    setErrorMsg('');
    setUnverifiedEmail('');
  };

  const fillDemoCustomer = () => {
    setEmail('user@kickhomecare.com');
    setPassword('user123');
    setErrorMsg('');
    setUnverifiedEmail('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-rose-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Form Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/40 border border-slate-100 relative z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Card Header & Store Link */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black tracking-widest uppercase border border-red-100">
            <Sparkles className="w-3 h-3 text-red-600" />
            <span>KICKS HOME CARE</span>
          </div>
        </div>

        {/* Brand Icon & Welcome Title */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/25 font-black text-2xl tracking-tighter">
            K
          </div>

          {authMode === 'signup' ? (
            <>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Join Kicks for instant order tracking, fast checkout & exclusive offers.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Sign in to manage your orders, wishlist, and profile.
              </p>
            </>
          )}
        </div>

        {/* Auth Mode Toggle Tabs (Sign In / Sign Up) */}
        <div className="p-1 bg-slate-100 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
              setUnverifiedEmail('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'signin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
              setUnverifiedEmail('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>

            {/* Unverified Email Resend CTA (Section 11) */}
            {unverifiedEmail && (
              <div className="pt-1 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-600 font-normal">Need a new verification link?</span>
                <button
                  type="button"
                  onClick={handleResendFromLogin}
                  disabled={resending}
                  className="text-xs font-black text-red-700 hover:text-red-800 underline underline-offset-2 flex items-center gap-1"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Resend Verification Email</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: SIGN IN FORM                                      */}
        {/* ========================================================= */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-red-600">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Quick Demo Credentials for Testing */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">
                Quick Demo Accounts (Click to Fill)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-red-500" />
                  <span>Admin Demo</span>
                </button>
                <button
                  type="button"
                  onClick={fillDemoCustomer}
                  className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <User className="w-3 h-3 text-slate-500" />
                  <span>Customer Demo</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SIGN UP FORM                                      */}
        {/* ========================================================= */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Saif Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-red-600">*</span>
                </label>
                {password && (
                  <span className={`text-[10px] font-bold ${
                    passStrength <= 1 ? 'text-rose-500' : passStrength <= 3 ? 'text-amber-500' : 'text-emerald-600'
                  }`}>
                    {passStrength <= 1 ? 'Weak' : passStrength <= 3 ? 'Good' : 'Strong'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="flex gap-1 mt-1.5">
                  <div className={`h-1 flex-1 rounded-full ${passStrength >= 1 ? 'bg-red-500' : 'bg-slate-200'}`} />
                  <div className={`h-1 flex-1 rounded-full ${passStrength >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                  <div className={`h-1 flex-1 rounded-full ${passStrength >= 3 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  <div className={`h-1 flex-1 rounded-full ${passStrength >= 4 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                </div>
              )}
            </div>

            {/* Verification notice */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <span>We&apos;ll email you a secure link to verify your email address.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* Security footer */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-[11px] text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Kicks Home Care. Safe & 256-Bit Encrypted Connection.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
