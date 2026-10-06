'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OtpInput from '@/components/OtpInput';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp, verifyEmail } = useAuth();

  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';

  const redirectParam = searchParams.get('redirect') || searchParams.get('next') || '';

  // UI state
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [status, setStatus] = useState('input'); // 'input' | 'verifying' | 'success' | 'expired' | 'invalid'
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 60-Second Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timerSeconds > 0 && status !== 'success') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerSeconds, status]);

  const executeLegacyToken = React.useCallback(async (rawToken) => {
    setStatus('verifying');
    setErrorMsg('');
    const res = await verifyEmail(rawToken, email);
    if (res.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kicks_verify_email');
      }
      setStatus('success');
      setSuccessMsg('Email verified successfully! Your account is active.');
    } else {
      if (res.expired) {
        setStatus('expired');
        setErrorMsg('This verification link has expired. Please request a new code.');
      } else {
        setStatus('invalid');
        setErrorMsg(res.message || 'Invalid verification link.');
      }
    }
  }, [email, verifyEmail]);

  const executeVerification = React.useCallback(async (codeToVerify, emailToVerify) => {
    const targetEmail = (emailToVerify || email || (typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_email') : '') || '').trim().toLowerCase();
    if (!targetEmail || !codeToVerify || codeToVerify.length !== 6) {
      setErrorMsg('Please enter your email and full 6-digit code.');
      return;
    }

    setStatus('verifying');
    setErrorMsg('');
    setSuccessMsg('');

    const res = await verifyOtp(targetEmail, codeToVerify, 'EMAIL_VERIFICATION');

    if (res.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kicks_verify_email');
      }
      setStatus('success');
      setSuccessMsg('Email verified successfully! Your account is active.');
    } else {
      if (res.expired) {
        setStatus('expired');
        setErrorMsg('This verification code has expired. Please request a new one.');
      } else {
        setStatus('invalid');
        setErrorMsg(res.message || 'Invalid verification code.');
      }
    }
  }, [email, verifyOtp]);

  // Handle token or OTP passed via URL query
  useEffect(() => {
    const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_email') : null;
    const initialEmail = emailParam || storedEmail || '';
    if (initialEmail) {
      setEmail(initialEmail);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kicks_verify_email', initialEmail);
      }
    }

    if (tokenParam) {
      if (/^\d{6}$/.test(tokenParam.trim())) {
        setOtpCode(tokenParam.trim());
        if (initialEmail) {
          executeVerification(tokenParam.trim(), initialEmail);
        }
      } else {
        // Legacy 64-char token link
        executeLegacyToken(tokenParam.trim());
      }
    }
  }, [tokenParam, emailParam, executeVerification, executeLegacyToken]);

  const handleVerifySubmit = (e) => {
    if (e) e.preventDefault();
    executeVerification(otpCode, email);
  };

  const handleResend = async () => {
    if (timerSeconds > 0 || resending) return;
    const targetEmail = (email || (typeof window !== 'undefined' ? sessionStorage.getItem('kicks_verify_email') : '') || '').trim().toLowerCase();
    if (!targetEmail) {
      setErrorMsg('Please enter your email address to receive a code.');
      return;
    }

    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await resendOtp(targetEmail, 'EMAIL_VERIFICATION');
    setResending(false);

    if (res.success) {
      setSuccessMsg(res.message || 'A fresh 6-digit code has been dispatched to your email!');
      setTimerSeconds(60);
      setOtpCode('');
      setStatus('input');
    } else {
      if (res.retryAfter && res.retryAfter > 0) {
        setTimerSeconds(res.retryAfter);
      }
      setErrorMsg(res.message || 'Failed to resend code.');
    }
  };

  const maskedEmail = email && email.includes('@')
    ? `${email.split('@')[0].slice(0, 2)}***@${email.split('@')[1]}`
    : email;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 text-center">

            {/* Status Icon */}
            <div className="mb-6">
              {status === 'success' ? (
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              ) : status === 'expired' ? (
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
                  <Clock className="w-8 h-8" />
                </div>
              ) : status === 'invalid' ? (
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                  <AlertCircle className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {status === 'success' ? 'Email Verified!' : 'Verify Your Email'}
            </h1>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              {status === 'success' ? (
                'Your account has been fully verified and activated. You can now access your account dashboard.'
              ) : (
                <>
                  We&apos;ve sent a 6-digit verification code to:
                  <br />
                  <strong className="text-slate-800 font-semibold">{maskedEmail || 'your email'}</strong>
                </>
              )}
            </p>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <div className="mt-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs text-left font-medium">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs text-left font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* SUCCESS STATE */}
            {status === 'success' ? (
              <div className="mt-8 space-y-3">
                <Link
                  href={redirectParam || "/dashboard"}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2"
                >
                  {redirectParam && redirectParam.includes('checkout') ? 'Proceed to Checkout' : 'Continue to Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : "/login"}
                  className="block text-xs font-semibold text-slate-500 hover:text-slate-800 transition pt-2"
                >
                  Go to Sign In
                </Link>
              </div>
            ) : (
              /* INPUT STATE */
              <div className="mt-6 space-y-5">
                {!email && (
                  <div className="text-left">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 6-Digit OTP Box Component */}
                <OtpInput
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (val.length === 6) setErrorMsg('');
                  }}
                  disabled={status === 'verifying'}
                />

                {/* Timer & Resend Box */}
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
                    onClick={handleResend}
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

                {/* Submit Action */}
                <button
                  type="button"
                  onClick={handleVerifySubmit}
                  disabled={status === 'verifying' || otpCode.length !== 6 || !email}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {status === 'verifying' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
