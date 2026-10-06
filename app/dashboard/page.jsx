'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AccountPage from '@/app/account/page';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.emailVerified === false && user.role !== 'admin') {
        router.push(`/verify-email?email=${encodeURIComponent(user.email || '')}`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Access Denied</h2>
          <p className="text-xs text-slate-500 mb-6">
            You must be signed in with a verified account to view the dashboard.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-red-700 transition"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  if (user.emailVerified === false && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Email Verification Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Your account is currently unverified. Please verify your email with the 6-digit code to access your dashboard.
          </p>
          <Link
            href={`/verify-email?email=${encodeURIComponent(user.email || '')}`}
            className="inline-block px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-red-700 transition"
          >
            Verify Email Now
          </Link>
        </div>
      </div>
    );
  }

  return <AccountPage />;
}
