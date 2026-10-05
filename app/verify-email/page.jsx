'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();

  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';
  const sentParam = searchParams.get('sent');

  // UI status: 'loading' | 'success' | 'already-verified' | 'expired' | 'invalid' | 'check-email'
  const [status, setStatus] = useState('loading');
  const [resendEmail, setResendEmail] = useState(emailParam);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle Token Verification on mount if token is in query
  useEffect(() => {
    if (tokenParam) {
      performVerification(tokenParam);
    } else if (emailParam || sentParam) {
      setStatus('check-email');
    } else {
      setStatus('check-email');
    }
  }, [tokenParam, emailParam, sentParam]);

  const performVerification = async (rawToken) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await verifyEmail(rawToken);

      if (res.success) {
        if (res.alreadyVerified) {
          setStatus('already-verified');
        } else {
          setStatus('success');
        }
      } else {
        if (res.expired) {
          setStatus('expired');
          setErrorMessage(res.message || 'This verification link has expired.');
        } else if (res.alreadyVerified) {
          setStatus('already-verified');
        } else {
          setStatus('invalid');
          setErrorMessage(res.message || 'Invalid verification link.');
        }
      }
    } catch (err) {
      setStatus('invalid');
      setErrorMessage('Unable to verify email. Please try again.');
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    if (resendCooldown > 0 || resending) return;

    if (!resendEmail || !resendEmail.trim()) {
      setErrorMessage('Please enter your email address to resend verification.');
      return;
    }

    setResending(true);
    setFeedbackMsg('');
    setErrorMessage('');

    try {
      const res = await resendVerification(resendEmail.trim());
      setResending(false);

      if (res.success) {
        setResendCooldown(60);
        if (res.alreadyVerified) {
          setStatus('already-verified');
        } else {
          setFeedbackMsg('A fresh verification link has been sent to your email.');
        }
      } else {
        setErrorMessage(res.message || 'Failed to resend email. Please try again later.');
      }
    } catch (err) {
      setResending(false);
      setErrorMessage('Failed to send verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-rose-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/40 border border-slate-100 relative z-10 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black tracking-widest uppercase border border-red-100">
            <Sparkles className="w-3 h-3 text-red-600" />
            <span>KICKS HOME CARE</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STATE 1: LOADING                                               */}
        {/* ============================================================== */}
        {status === 'loading' && (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verifying your email...
            </h1>
            <p className="text-xs text-slate-500">
              Please wait a moment while we validate your verification link.
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 2: SUCCESS                                               */}
        {/* ============================================================== */}
        {status === 'success' && (
          <div className="py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Email verified successfully!
              </h1>
              <p className="text-xs text-slate-500">
                Your account is now active. You can now sign in to start shopping.
              </p>
            </div>

            <div className="pt-3">
              <Link
                href="/login?tab=signin"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Login</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 3: ALREADY VERIFIED                                      */}
        {/* ============================================================== */}
        {status === 'already-verified' && (
          <div className="py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
              <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Your email is already verified.
              </h1>
              <p className="text-xs text-slate-500">
                You can proceed directly to sign in to your Kicks account.
              </p>
            </div>

            <div className="pt-3">
              <Link
                href="/login?tab=signin"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Login</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 4: EXPIRED TOKEN                                         */}
        {/* ============================================================== */}
        {status === 'expired' && (
          <div className="py-2 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
              <Clock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                This verification link has expired.
              </h1>
              <p className="text-xs text-slate-500">
                Verification links expire after 30 minutes for security reasons. Enter your email below to receive a new link.
              </p>
            </div>

            {feedbackMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-2xl">
                {feedbackMsg}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3 pt-1">
              <div className="relative text-left">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={resending || resendCooldown > 0}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Resend available in {resendCooldown}s</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2">
              <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 5: INVALID TOKEN                                         */}
        {/* ============================================================== */}
        {status === 'invalid' && (
          <div className="py-2 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertCircle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Invalid verification link.
              </h1>
              <p className="text-xs text-slate-500">
                This verification link is invalid or has already been used. Please request a new link below.
              </p>
            </div>

            {feedbackMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-2xl">
                {feedbackMsg}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3 pt-1">
              <div className="relative text-left">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={resending || resendCooldown > 0}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Resend available in {resendCooldown}s</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2">
              <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 6: CHECK YOUR EMAIL (AFTER SIGNUP OR MANUAL LANDING)      */}
        {/* ============================================================== */}
        {status === 'check-email' && (
          <div className="py-2 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-md shadow-red-500/10">
              <Mail className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Check your email
              </h1>
              <p className="text-xs text-slate-500">
                We&apos;ve sent a verification link to your email address:
              </p>
              {resendEmail && (
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-800 border border-slate-200">
                  {resendEmail}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              Please check your inbox and click the <strong>Verify Email</strong> button to activate your account.
              The verification link will expire in <strong>30 minutes</strong>.
            </p>

            {feedbackMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-2xl animate-in fade-in duration-150">
                {feedbackMsg}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-slate-400 font-medium">
                Didn&apos;t receive the email? Check your spam folder or:
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
                    <span>Sending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Resend available in {resendCooldown}s</span>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-red-600" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <Link
                href="/login?tab=signup"
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← Change Email
              </Link>

              <Link
                href="/login?tab=signin"
                className="text-red-600 hover:text-red-700 font-bold"
              >
                Back to Login →
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Security footer */}
      <p className="text-[11px] text-slate-400 font-medium mt-6 text-center">
        &copy; {new Date().getFullYear()} Kicks Home Care. Safe & 256-Bit Encrypted Connection.
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
