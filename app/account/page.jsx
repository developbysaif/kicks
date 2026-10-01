'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <User className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Please Sign In to Access Your Dashboard</h2>
          <Link href="/login" className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs">
            Sign In / Register
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <p className="text-xs text-slate-500">{user.email} • {user.phone || 'No phone'}</p>
            </div>
          </div>

          <button onClick={logout} className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>My Orders ({orders.length})</span>
          </h2>

          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400 font-bold">Loading orders...</div>
          ) : orders.length === 0 ? (
            <p className="text-xs text-slate-400">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{o.orderId}</span>
                    <span className="text-slate-400 text-[11px]">{new Date(o.createdAt).toLocaleDateString()}</span>
                    <div className="mt-2 space-y-1">
                      {o.orderItems.map((item, idx) => (
                        <div key={idx} className="text-slate-700 font-medium">{item.name} x {item.quantity}</div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right sm:text-right flex sm:flex-col justify-between items-end">
                    <div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] uppercase block mb-1">
                        {o.orderStatus}
                      </span>
                      <span className="font-black text-slate-900 text-sm">Rs. {o.grandTotal}</span>
                    </div>
                    <Link href={`/track-order?orderId=${o.orderId}`} className="text-emerald-600 font-bold hover:underline text-[11px] mt-2 block">
                      Track Live →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
