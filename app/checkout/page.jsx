'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OtpInput from '@/components/OtpInput';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ShoppingBag,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  Clock,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    loading: authChecking,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout
  } = useAuth();
  const {
    cartItems,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    coupon,
    clearCart
  } = useCart();

  // Shipping Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Embedded Checkout Auth Panel State
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register' | 'verify-otp'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showAuthPass, setShowAuthPass] = useState(false);
  const [authOtpCode, setAuthOtpCode] = useState('');
  const [authTimerSeconds, setAuthTimerSeconds] = useState(60);
  const [authResending, setAuthResending] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Synchronize user profile into shipping details when logged in
  useEffect(() => {
    if (user) {
      if (user.name && !fullName) setFullName(user.name);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  // Live 60-Second Countdown Timer for OTP verification on checkout
  useEffect(() => {
    let interval = null;
    if (authMode === 'verify-otp' && authTimerSeconds > 0) {
      interval = setInterval(() => {
        setAuthTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode, authTimerSeconds]);

  // 1. Embedded Checkout Sign In
  const handleCheckoutSignIn = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    const res = await login(authEmail, authPassword);
    setAuthSubmitting(false);

    if (res.success) {
      setAuthSuccess('Signed in successfully! Unlocking checkout...');
      if (res.user?.name) setFullName(res.user.name);
      if (res.user?.phone) setPhone(res.user.phone);
    } else if (res.requireVerification) {
      // Unverified account: switch to OTP verification step
      setAuthError(res.message || "Your email is unverified. We've sent a 6-digit verification code to your email.");
      setAuthOtpCode('');
      setAuthTimerSeconds(60);
      setAuthMode('verify-otp');
    } else {
      setAuthError(res.message || 'Invalid email or password.');
    }
  };

  // 2. Embedded Checkout Registration
  const handleCheckoutRegister = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    if (authPassword !== authConfirmPassword) {
      setAuthSubmitting(false);
      setAuthError('Passwords do not match.');
      return;
    }

    if (authPassword.length < 6) {
      setAuthSubmitting(false);
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const cleanEmail = authEmail.trim().toLowerCase();
    const res = await register(authName, cleanEmail, authPassword, authConfirmPassword, authPhone);
    setAuthSubmitting(false);

    if (res.success) {
      setAuthSuccess(res.message || "We've sent a 6-digit verification code to your email.");
      setAuthOtpCode('');
      setAuthTimerSeconds(60);
      setAuthMode('verify-otp');
    } else {
      setAuthError(res.message || 'Registration failed. Please try again.');
    }
  };

  // 3. Embedded Checkout OTP Verification
  const handleCheckoutVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (authOtpCode.length !== 6) {
      setAuthError('Please enter the complete 6-digit verification code.');
      return;
    }

    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Email address is missing. Please restart sign in.');
      setAuthMode('signin');
      return;
    }

    setAuthSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    const res = await verifyOtp(cleanEmail, authOtpCode, 'EMAIL_VERIFICATION');
    setAuthSubmitting(false);

    if (res.success) {
      setAuthSuccess('Email verified successfully! Checkout unlocked.');
      if (authName) setFullName(authName);
      if (authPhone) setPhone(authPhone);
    } else {
      setAuthError(res.message || 'Invalid verification code.');
    }
  };

  // 4. Embedded Checkout Resend OTP
  const handleCheckoutResendOtp = async () => {
    if (authTimerSeconds > 0 || authResending) return;

    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Please enter your email to receive a new code.');
      return;
    }

    setAuthResending(true);
    setAuthError('');
    setAuthSuccess('');

    const res = await resendOtp(cleanEmail, 'EMAIL_VERIFICATION');
    setAuthResending(false);

    if (res.success) {
      setAuthSuccess(res.message || 'A fresh 6-digit verification code has been dispatched to your email!');
      setAuthTimerSeconds(60);
      setAuthOtpCode('');
    } else {
      if (res.retryAfter && res.retryAfter > 0) {
        setAuthTimerSeconds(res.retryAfter);
      }
      setAuthError(res.message || 'Failed to resend verification code.');
    }
  };

  // 5. Final Order Placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city) {
      setErrorMsg('Please fill in all required shipping address fields');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product._id || item.product,
        name: item.product.name || item.name,
        image: item.product.images?.[0] || item.image || '',
        price: item.price,
        quantity: item.quantity,
        variation: item.variation || ''
      }));

      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress: {
            fullName,
            phone,
            addressLine,
            city,
            province,
            country: 'Pakistan'
          },
          paymentMethod: 'Cash on Delivery',
          subtotal,
          discount: discountAmount,
          shippingFee,
          grandTotal,
          couponCode: coupon?.code || '',
          notes
        },
        { headers }
      );

      if (data.success) {
        clearCart();
        setOrderSuccess(data.order);
      } else {
        setErrorMsg(data.message || 'Failed to place order');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart display
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">Add items to your cart before proceeding to checkout.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md"
          >
            Return to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Order Success Display
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Order Placed Successfully!</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Thank you for ordering with Kicks. Your order ID is{' '}
            <strong className="text-emerald-600 font-extrabold">{orderSuccess.orderId}</strong>.
          </p>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-left text-xs space-y-3 shadow-sm max-w-md mx-auto">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-bold text-slate-800">Cash on Delivery</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Grand Total:</span>
              <span className="font-bold text-emerald-600">Rs. {orderSuccess.grandTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-bold text-slate-800 text-right">
                {orderSuccess.shippingAddress?.addressLine}, {orderSuccess.shippingAddress?.city}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Link
              href={`/track-order?orderId=${orderSuccess.orderId}`}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Track Order Live
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading auth session check
  if (authChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-slate-500 font-semibold">Checking authentication details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Checkout Header / Breadcrumb */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Checkout — Cash on Delivery
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {user
                ? 'Review your items and complete shipping details below to place order.'
                : 'Step 1 of 2: Please sign in or register to complete your order.'}
            </p>
          </div>

          {/* Stepper Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-bold self-start">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                user ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'
              }`}
            >
              1
            </span>
            <span className={user ? 'text-emerald-700 font-extrabold' : 'text-slate-900'}>
              {user ? 'Account Verified' : 'Sign In Required'}
            </span>
            <span className="text-slate-300">→</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                user ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={user ? 'text-slate-900 font-bold' : 'text-slate-400'}>Shipping & COD</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CASE 1: USER NOT LOGGED IN — SHOW LOGIN & REGISTER PANEL */}
        {/* ======================================================== */}
        {!user && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Auth Gate Panel */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40">
              
              {/* Header inside Panel */}
              <div className="mb-6 pb-5 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-wider rounded-full mb-2">
                    <Lock className="w-3.5 h-3.5" />
                    Authentication Required
                  </span>
                  <h2 className="text-xl font-black text-slate-900">
                    {authMode === 'signin' && 'Sign In to Proceed with Checkout'}
                    {authMode === 'register' && 'Create Your Kicks Account'}
                    {authMode === 'verify-otp' && 'Verify Your Email to Continue'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {authMode === 'signin' && 'Log in with your existing account to unlock instant shipping details.'}
                    {authMode === 'register' && 'Sign up in seconds to track orders, save addresses, and earn points.'}
                    {authMode === 'verify-otp' && 'Enter the 6-digit code sent to your email to unlock checkout.'}
                  </p>
                </div>
              </div>

              {/* Tab Selector (Sign In vs Register) */}
              {authMode !== 'verify-otp' && (
                <div className="p-1 bg-slate-100 rounded-2xl flex items-center mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                      authMode === 'signin'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sign In to Existing Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                      authMode === 'register'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Create New Account
                  </button>
                </div>
              )}

              {/* Alert Feedback */}
              {authError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="flex-1">{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="flex-1">{authSuccess}</span>
                </div>
              )}

              {/* 1. Sign In Form */}
              {authMode === 'signin' && (
                <form onSubmit={handleCheckoutSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Password *
                      </label>
                      <Link
                        href="/login?tab=forgot"
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showAuthPass ? 'text' : 'password'}
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthPass(!showAuthPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showAuthPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {authSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In & Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Need a separate full login page?{' '}
                      <Link
                        href="/login?redirect=/checkout"
                        className="font-bold text-red-600 hover:text-red-700 underline"
                      >
                        Open Full Login Screen
                      </Link>
                    </p>
                  </div>
                </form>
              )}

              {/* 2. Register Form */}
              {authMode === 'register' && (
                <form onSubmit={handleCheckoutRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="03001234567"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showAuthPass ? 'text' : 'password'}
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthPass(!showAuthPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showAuthPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showAuthPass ? 'text' : 'password'}
                          required
                          value={authConfirmPassword}
                          onChange={(e) => setAuthConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {authSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account & Verify Code
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 3. OTP Verification Form */}
              {authMode === 'verify-otp' && (
                <div className="space-y-5 text-center">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">Enter 6-Digit Code</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      We&apos;ve sent a verification code to:{' '}
                      <strong className="text-slate-800">{authEmail}</strong>
                    </p>
                  </div>

                  {/* 6-Digit OTP Input */}
                  <OtpInput
                    value={authOtpCode}
                    onChange={(val) => {
                      setAuthOtpCode(val);
                      if (val.length === 6) setAuthError('');
                    }}
                    disabled={authSubmitting}
                  />

                  {/* 60s Live Timer & Resend */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Expires in:</span>
                      <span
                        className={`font-mono font-bold ${
                          authTimerSeconds <= 10 ? 'text-red-600 animate-pulse' : 'text-slate-900'
                        }`}
                      >
                        00:{authTimerSeconds < 10 ? `0${authTimerSeconds}` : authTimerSeconds}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={authTimerSeconds > 0 || authResending}
                      onClick={handleCheckoutResendOtp}
                      className={`font-bold transition flex items-center gap-1 ${
                        authTimerSeconds === 0 && !authResending
                          ? 'text-red-600 hover:text-red-700 underline cursor-pointer'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {authResending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Resend Code'
                      )}
                    </button>
                  </div>

                  {/* Submit Verify Code */}
                  <button
                    type="button"
                    onClick={handleCheckoutVerifyOtp}
                    disabled={authSubmitting || authOtpCode.length !== 6}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {authSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying Code...
                      </>
                    ) : (
                      <>
                        Verify & Unlock Checkout
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Order Items Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-black text-slate-900">Your Cart Preview</h3>
                  <span className="text-xs font-bold text-slate-500">{cartItems.length} items</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="py-2.5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-800 line-clamp-1">{item.product?.name || item.name}</span>
                          <span className="text-slate-400 block text-[11px]">
                            Qty: {item.quantity} {item.variation && `(${item.variation})`}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 shrink-0">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">Rs. {subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-Rs. {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="font-bold text-slate-800">
                      {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `Rs. ${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total Payable:</span>
                    <span className="text-emerald-600">Rs. {grandTotal}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-medium">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Your cart items are securely reserved while you sign in.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CASE 2: USER LOGGED IN — SHOW SHIPPING & PAYMENT FORM   */}
        {/* ======================================================== */}
        {user && (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Form: Shipping Details */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Authenticated User Status Bar */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Logged in as: <strong>{user.name || 'Customer'}</strong> ({user.email})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Switch Account
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Shipping & Delivery Details</span>
              </h2>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Recipient's Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Complete House Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street #, Sector / Area / Colony"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Province *</label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Delivery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., Call before arriving, leave at gate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              {/* Payment Info Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-900">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-emerald-700">
                    Pay the complete amount in cash directly to the courier when the parcel arrives at your doorstep.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 border-b pb-3">Order Summary</h3>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="py-2.5 flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{item.product?.name || item.name}</span>
                        <span className="text-slate-400 block text-[11px]">
                          Qty: {item.quantity} {item.variation && `(${item.variation})`}
                        </span>
                      </div>
                      <span className="font-extrabold text-slate-900">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">Rs. {subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-Rs. {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="font-bold text-slate-800">
                      {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `Rs. ${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total Payable:</span>
                    <span className="text-emerald-600">Rs. {grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    'Confirm Cash on Delivery Order'
                  )}
                </button>
              </div>
            </div>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
