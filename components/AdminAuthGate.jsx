'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import OtpInput from '@/components/OtpInput';

export default function AdminAuthGate() {
  const { user, logout, setAuthUser } = useAuth();

  // Mode: 'login' | 'signup' (First-time setup) | 'verify-otp'
  const [mode, setMode] = useState('login');
  const [hasExistingAdmin, setHasExistingAdmin] = useState(true);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [resending, setResending] = useState(false);

  // Feedback status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Check whether a verified admin already exists in the system
  useEffect(() => {
    let isMounted = true;
    async function checkSetup() {
      try {
        const { data } = await axios.get('/api/admin/auth/setup-status');
        if (isMounted) {
          if (data && data.success) {
            setHasExistingAdmin(Boolean(data.hasAdmin));
            if (!data.hasAdmin) {
              setMode('signup'); // First-time setup required
            } else {
              setMode('login');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching admin setup status:', err);
      } finally {
        if (isMounted) setCheckingSetup(false);
      }
    }
    checkSetup();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Countdown timer for OTP resend cooldown
  useEffect(() => {
    let interval = null;
    if (mode === 'verify-otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, timerSeconds]);

  // Helper: Mask email for privacy (e.g., sa***@kickhomecare.com)
  const getMaskedEmail = (rawEmail) => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [userPart, domainPart] = rawEmail.split('@');
    if (userPart.length <= 2) return `${userPart[0]}***@${domainPart}`;
    return `${userPart[0]}***${userPart[userPart.length - 1]}@${domainPart}`;
  };

  // 3. Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data } = await axios.post('/api/admin/auth/login', {
        email: email.trim(),
        password
      });

      if (data.success && data.user) {
        setSuccessMsg('Authentication successful! Accessing admin panel...');
        setAuthUser(data.user);
      } else {
        setErrorMsg(data.message || 'Admin login failed.');
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.requireVerification) {
        // Admin account exists but requires OTP verification
        setErrorMsg(resp.message || 'Admin account verification required. Enter the 6-digit code sent to your email.');
        setMode('verify-otp');
        setOtpCode('');
        setTimerSeconds(60);
      } else {
        const msg = resp?.message || err.message || 'Login failed. Please check credentials.';
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle First-Time Admin Registration / Setup
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data } = await axios.post('/api/admin/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        phone: phone.trim()
      });

      if (data.success && data.requireVerification) {
        setSuccessMsg(data.message || 'Verification code dispatched! Please enter the 6-digit code sent to your email.');
        setMode('verify-otp');
        setOtpCode('');
        setTimerSeconds(60);
      } else if (data.success && data.user) {
        setSuccessMsg('Admin account verified! Accessing admin panel...');
        setAuthUser(data.user);
      } else {
        setErrorMsg(data.message || 'Admin setup failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Setup failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Admin OTP Verification
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data } = await axios.post('/api/admin/auth/verify-otp', {
        email: email.trim(),
        otp: otpCode.trim()
      });

      if (data.success && data.user) {
        setSuccessMsg('Admin verification confirmed! Unlocking admin panel...');
        setHasExistingAdmin(true);
        setTimeout(() => {
          setAuthUser(data.user);
        }, 500);
      } else {
        setErrorMsg(data.message || 'Verification failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Verification failed. Please check the code and try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Resend Admin OTP
  const handleResendOtp = async () => {
    if (timerSeconds > 0 || resending) return;

    if (!email) {
      setErrorMsg('Please enter your administrator email.');
      return;
    }

    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data } = await axios.post('/api/admin/auth/resend-otp', {
        email: email.trim()
      });

      if (data.success) {
        setSuccessMsg(data.message || 'A fresh 6-digit verification code has been dispatched to your email.');
        setTimerSeconds(60);
        setOtpCode('');
      } else {
        setErrorMsg(data.message || 'Failed to resend code.');
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.retryAfter) {
        setTimerSeconds(resp.retryAfter);
      }
      setErrorMsg(resp?.message || err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  const isCustomerLoggedIn = user && user.role !== 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#101c2e] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      
      {/* Background Accent Gradients */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Top Header with Kick Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group transition-transform hover:scale-105">
            <div className="bg-white rounded-3xl p-3 shadow-2xl inline-block border border-white/20">
              <img
                src="/kick%20logo.png"
                alt="Kick Home Care"
                className="h-14 sm:h-16 w-auto object-contain mx-auto"
              />
            </div>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <span>Kick Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Authorized personnel control center & catalog management
            </p>
          </div>
        </div>

        {/* Non-Admin Account Notice */}
        {isCustomerLoggedIn && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-2 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Customer Account Detected</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Signed in as <strong className="text-white">{user.name || user.email}</strong> with customer privileges. Sign in with an admin account below.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={logout}
                className="text-[11px] font-bold text-amber-300 hover:text-white underline transition"
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
          
          {/* Tabs: Sign In / Initial Setup (Only shown if setup is allowed and not in OTP mode) */}
          {mode !== 'verify-otp' && !checkingSetup && !hasExistingAdmin && (
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>First-Time Setup</span>
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. ADMIN SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@kickhomecare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!hasExistingAdmin && !checkingSetup && (
                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-400">
                    First-time setup?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg('');
                      }}
                      className="text-red-400 font-bold hover:underline"
                    >
                      Complete Admin Setup
                    </button>
                  </p>
                </div>
              )}
            </form>
          )}

          {/* 2. ADMIN SETUP / SIGN UP FORM (Only available if no verified admin exists) */}
          {mode === 'signup' && !hasExistingAdmin && (
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Muhammad Saif"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Admin Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="saif@kickhomecare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Initiating Admin Setup...</span>
                  </>
                ) : (
                  <>
                    <span>Create & Verify Administrator</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  Already have an admin account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-red-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 3. ADMIN OTP VERIFICATION SCREEN */}
          {mode === 'verify-otp' && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-black text-white">
                  Admin Email Verification
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  A 6-digit security code was dispatched to:{' '}
                  <strong className="text-white">{getMaskedEmail(email)}</strong>
                </p>
              </div>

              {/* 6-Digit OTP Box (Dark Mode) */}
              <OtpInput
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  if (val.length === 6) {
                    setErrorMsg('');
                  }
                }}
                disabled={loading}
                dark={true}
              />

              {/* Cooldown Timer & Resend */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Expires in:</span>
                  <span className={`font-mono font-bold ${timerSeconds <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
                    00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={timerSeconds > 0 || resending}
                  onClick={handleResendOtp}
                  className={`font-bold transition flex items-center gap-1 ${
                    timerSeconds === 0 && !resending
                      ? 'text-red-400 hover:text-red-300 underline cursor-pointer'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {resending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>

              {/* Verify Action Button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Unlock Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Storefront return link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Kick Storefront</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
