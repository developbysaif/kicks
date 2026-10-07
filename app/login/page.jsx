'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpInput from '@/components/OtpInput';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock,
  KeyRound
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, verifyOtp, resendOtp, forgotPassword, resetPassword } = useAuth();

  // Active view: 'signin' | 'signup' | 'verify-otp' | 'forgot-email' | 'forgot-otp' | 'forgot-newpass'
  const [view, setView] = useState('signin');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Fields
  const [otpCode, setOtpCode] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('EMAIL_VERIFICATION'); // 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [resending, setResending] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devHintCode, setDevHintCode] = useState('');

  // Check URL parameters & session storage on mount
  const redirectParam = searchParams.get('redirect') || searchParams.get('next') || '';

  useEffect(() => {
    const tab = searchParams.get('tab');
    const emailParam = searchParams.get('email');
    const verifyParam = searchParams.get('verify');
    const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_email') : null;
    const storedView = typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_view') : null;

    const activeEmail = emailParam || storedEmail || '';
    if (activeEmail) setEmail(activeEmail);

    if (verifyParam === 'true' && activeEmail) {
      setView('verify-otp');
      setOtpPurpose('EMAIL_VERIFICATION');
      setTimerSeconds(60);
    } else if (storedView === 'verify-otp' && activeEmail) {
      setView('verify-otp');
      setOtpPurpose('EMAIL_VERIFICATION');
    } else if (tab === 'register' || tab === 'signup') {
      setView('signup');
    } else if (tab === 'forgot') {
      setView('forgot-email');
    } else {
      setView('signin');
    }
  }, [searchParams]);

  // Live 60-Second Countdown Timer
  useEffect(() => {
    let interval = null;
    if ((view === 'verify-otp' || view === 'forgot-otp') && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timerSeconds]);

  // Helper to mask email (e.g. u***@gmail.com)
  const getMaskedEmail = (rawEmail) => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [userPart, domainPart] = rawEmail.split('@');
    if (userPart.length <= 2) return `${userPart[0]}***@${domainPart}`;
    return `${userPart[0]}***${userPart[userPart.length - 1]}@${domainPart}`;
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    return score;
  };
  const passStrength = getPasswordStrength(password);

  // 1. Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kicks_verify_email');
        sessionStorage.removeItem('kicks_verify_view');
      }
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        if (redirectParam) {
          router.push(redirectParam);
        } else if (res.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } else if (res.requireVerification) {
      // Unverified account: Transition to OTP verification screen with fresh 60s timer
      const cleanEmail = email.trim().toLowerCase();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kicks_verify_email', cleanEmail);
        sessionStorage.setItem('kicks_verify_view', 'verify-otp');
      }
      setErrorMsg(res.message || "Your email is not verified. We've sent a 6-digit verification code to your email.");
      setOtpPurpose('EMAIL_VERIFICATION');
      setOtpCode('');
      setTimerSeconds(60);
      setView('verify-otp');
    } else {
      setErrorMsg(res.message || 'Authentication failed. Please check your credentials.');
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setLoading(false);
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const res = await register(name, cleanEmail, password, confirmPassword, phone);
    setLoading(false);

    if (res.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kicks_verify_email', cleanEmail);
        sessionStorage.setItem('kicks_verify_view', 'verify-otp');
      }
      setSuccessMsg(res.message || "We've sent a 6-digit verification code to your email.");
      setOtpPurpose('EMAIL_VERIFICATION');
      setOtpCode('');
      setTimerSeconds(60);
      setView('verify-otp');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
  };

  // 3. Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    const activeEmail = email || (typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_email') : '');
    if (!activeEmail) {
      setErrorMsg('Email address not found. Please re-enter your email.');
      setView('signin');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await verifyOtp(activeEmail, otpCode, otpPurpose);
    setLoading(false);

    if (res.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kicks_verify_email');
        sessionStorage.removeItem('kicks_verify_view');
      }
      if (otpPurpose === 'EMAIL_VERIFICATION' || otpPurpose === 'LOGIN_VERIFICATION') {
        setSuccessMsg(redirectParam ? 'Email verified! Proceeding to checkout...' : 'Email verified successfully! Opening dashboard...');
        setTimeout(() => {
          if (redirectParam) {
            router.push(redirectParam);
          } else {
            router.push('/dashboard');
          }
        }, 600);
      } else if (otpPurpose === 'PASSWORD_RESET') {
        setResetToken(res.resetToken || '');
        setSuccessMsg('Code verified! Please create your new password.');
        setPassword('');
        setConfirmPassword('');
        setView('forgot-newpass');
      }
    } else {
      setErrorMsg(res.message || 'Invalid verification code.');
    }
  };

  // 4. Handle Resend OTP Code
  const handleResendOtp = async () => {
    if (timerSeconds > 0 || resending) return;

    const activeEmail = email || (typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_email') : '');
    if (!activeEmail) {
      setErrorMsg('Please provide your email address to receive a new code.');
      return;
    }

    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await resendOtp(activeEmail, otpPurpose);
    setResending(false);

    if (res.success) {
      setSuccessMsg(res.message || 'A fresh 6-digit verification code has been dispatched to your email!');
      setTimerSeconds(60);
      setOtpCode('');
    } else {
      if (res.retryAfter && res.retryAfter > 0) {
        setTimerSeconds(res.retryAfter);
      }
      setErrorMsg(res.message || 'Failed to resend verification code.');
    }
  };

  // 5. Handle Forgot Password - Request OTP
  const handleForgotSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || 'If an account exists, a 6-digit reset code has been sent.');
      if (res.devCode) setDevHintCode(res.devCode);
      setOtpPurpose('PASSWORD_RESET');
      setOtpCode('');
      setTimerSeconds(60);
      setView('forgot-otp');
    } else {
      setErrorMsg(res.message || 'Failed to request reset code.');
    }
  };

  // 6. Handle Set New Password
  const handleResetNewPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await resetPassword({
      email,
      otp: otpCode,
      resetToken,
      newPassword: password,
      confirmPassword
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Your password has been updated successfully! Please sign in.');
      setTimeout(() => {
        setPassword('');
        setConfirmPassword('');
        setView('signin');
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 font-sans selection:bg-red-500 selection:text-white py-10 sm:py-14">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">

          {/* Back to Home Link */}
          <div className="mb-4 flex items-center justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200/60"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-300">

            {/* Header Banner */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black px-8 pt-8 pb-7 text-center text-white overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/15 rounded-full blur-xl pointer-events-none" />

              {/* Kicks Logo & Brand Text */}
              <div className="relative flex flex-col items-center justify-center mb-3">
                <Link href="/" className="inline-flex flex-col items-center group focus:outline-none" title="Kicks Home Care">
                  <div className="bg-white px-5 py-2.5 rounded-2xl shadow-lg shadow-black/25 ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-200">
                    <img
                      src="/kick%20logo.png"
                      alt="Kicks Home Care"
                      className="h-10 sm:h-12 w-auto object-contain"
                    />
                  </div>
                  <span className="mt-2.5 text-xs sm:text-sm font-bold tracking-widest text-slate-200 uppercase group-hover:text-red-400 transition-colors">
                    kicks home care
                  </span>
                </Link>
              </div>

              {/* Title Section (Verification & Reset flows only) */}
              {view !== 'signin' && view !== 'signup' && (
                <div className="mt-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    {view === 'verify-otp' && 'Verify Your Email'}
                    {view === 'forgot-email' && 'Forgot Password'}
                    {view === 'forgot-otp' && 'Enter Reset Code'}
                    {view === 'forgot-newpass' && 'Create New Password'}
                  </h1>

                  <p className="mt-1.5 text-xs text-slate-300 font-medium">
                    {view === 'verify-otp' && 'Enter the 6-digit code sent to your email'}
                    {view === 'forgot-email' && "We'll send a 6-digit verification code to your email"}
                    {view === 'forgot-otp' && 'Enter the 6-digit code to reset your password'}
                    {view === 'forgot-newpass' && 'Set a strong new password for your account'}
                  </p>
                </div>
              )}

              {/* Mode Switch Tabs (Only on Sign In / Sign Up) */}
              {(view === 'signin' || view === 'signup') && (
                <div className="mt-4 p-1 bg-white/10 backdrop-blur-md rounded-2xl flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('signin');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      view === 'signin'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('signup');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      view === 'signup'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Body Form Area */}
            <div className="p-6 sm:p-8">

              {/* Checkout Gate Notice */}
              {redirectParam && redirectParam.includes('checkout') && (
                <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-semibold">
                  <span className="text-base">ðŸ›’</span>
                  <span>Please sign in or create an account to proceed with your order checkout.</span>
                </div>
              )}

              {/* Alerts */}
              {errorMsg && (
                <div className="mb-5 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-start gap-3 text-red-700 text-xs font-medium animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs font-medium animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{successMsg}</div>
                </div>
              )}

              {/* VIEW 1: SIGN IN */}
              {view === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setView('forgot-email');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In to Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setView('signup');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="font-bold text-red-600 hover:text-red-700"
                      >
                        Create one now
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* VIEW 2: SIGN UP */}
              {view === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="03001234567"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="flex-1 grid grid-cols-4 gap-1 h-1">
                          <div className={`rounded-full ${passStrength >= 1 ? 'bg-red-500' : 'bg-slate-200'}`} />
                          <div className={`rounded-full ${passStrength >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                          <div className={`rounded-full ${passStrength >= 3 ? 'bg-yellow-500' : 'bg-slate-200'}`} />
                          <div className={`rounded-full ${passStrength >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {passStrength <= 1 && 'Weak'}
                          {passStrength === 2 && 'Fair'}
                          {passStrength === 3 && 'Good'}
                          {passStrength === 4 && 'Strong'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account & Verify
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setView('signin');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="font-bold text-red-600 hover:text-red-700"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* VIEW 3: OTP VERIFICATION (Used for Registration & Unverified Login) */}
              {view === 'verify-otp' && (
                <div className="space-y-5 text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <ShieldCheck className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Enter 6-Digit Code
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      We&apos;ve sent a verification code to:{' '}
                      <strong className="text-slate-800">{getMaskedEmail(email)}</strong>
                    </p>
                  </div>

                  {/* 6-Digit OTP Input */}
                  <OtpInput
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      if (val.length === 6) {
                        setErrorMsg('');
                      }
                    }}
                    disabled={loading}
                  />

                  {/* 60s Live Timer & Resend */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Expires in:</span>
                      <span className={`font-mono font-bold ${timerSeconds <= 10 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                        00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={timerSeconds > 0 || resending}
                      onClick={handleResendOtp}
                      className={`font-bold transition flex items-center gap-1 ${
                        timerSeconds === 0 && !resending
                          ? 'text-red-600 hover:text-red-700 underline cursor-pointer'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {resending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Sending...
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
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('signin');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 4: FORGOT PASSWORD - STEP 1 (Enter Email) */}
              {view === 'forgot-email' && (
                <form onSubmit={handleForgotSubmitEmail} className="space-y-4">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-2">
                    <KeyRound className="w-7 h-7" />
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-base font-black text-slate-900">
                      Reset Password
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Enter your account email to receive a 6-digit verification code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Send 6-Digit Code
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('signin');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* VIEW 5: FORGOT PASSWORD - STEP 2 (Enter OTP) */}
              {view === 'forgot-otp' && (
                <div className="space-y-5 text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <ShieldCheck className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Enter Password Reset Code
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      A 6-digit code has been dispatched to:{' '}
                      <strong className="text-slate-800">{getMaskedEmail(email)}</strong>
                    </p>
                  </div>

                  <OtpInput
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      if (val.length === 6) setErrorMsg('');
                    }}
                    disabled={loading}
                  />

                  {/* Timer & Resend */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Expires in:</span>
                      <span className={`font-mono font-bold ${timerSeconds <= 10 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                        00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={timerSeconds > 0 || resending}
                      onClick={handleResendOtp}
                      className={`font-bold transition flex items-center gap-1 ${
                        timerSeconds === 0 && !resending
                          ? 'text-red-600 hover:text-red-700 underline cursor-pointer'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {resending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Resend Code'
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || otpCode.length !== 6}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying Code...
                      </>
                    ) : (
                      <>
                        Verify Code & Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot-email');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Change Email
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 6: FORGOT PASSWORD - STEP 3 (New Password) */}
              {view === 'forgot-newpass' && (
                <form onSubmit={handleResetNewPassword} className="space-y-4">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-2">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-base font-black text-slate-900">
                      Create New Password
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Enter and confirm your new secure password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        Update Password
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('signin');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Cancel and Sign In
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              256-Bit SSL Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-500" />
              Verified Kicks Security
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

