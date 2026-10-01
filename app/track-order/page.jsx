'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, CheckCircle2 } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId);
    }
  }, [initialId]);

  const handleTrack = async (idToSearch) => {
    const id = idToSearch || orderId;
    if (!id.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const { data } = await axios.get(`/api/orders/${id.trim()}`);
      if (data.success) {
        setOrder(data.order);
      } else {
        setErrorMsg('Order not found');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepStatus = (stepName) => {
    if (!order) return 'upcoming';
    const status = order.orderStatus;
    const currentIndex = steps.indexOf(status);
    const stepIndex = steps.indexOf(stepName);

    if (status === 'Cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-8 shadow-lg text-center">
        <Package className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h1 className="text-3xl font-black">Live Order Tracking</h1>
        <p className="text-xs text-slate-300 mt-1">Enter your Kick Order ID (e.g. KICK-123456) to trace status.</p>

        <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="mt-6 max-w-md mx-auto flex gap-2">
          <input
            type="text"
            placeholder="KICK-XXXXXX"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 px-4 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-600 font-bold p-4 rounded-2xl text-xs text-center border border-rose-200">
          {errorMsg}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 gap-2">
            <div>
              <span className="text-xs text-slate-400 block">Order ID</span>
              <span className="text-lg font-black text-slate-900">{order.orderId}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Status</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="py-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Delivery Timeline</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.map((step) => {
                const state = getStepStatus(step);
                return (
                  <div key={step} className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${state === 'completed' || state === 'current' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                      {state === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : step.charAt(0)}
                    </div>
                    <span className={`text-[11px] font-bold ${state === 'current' ? 'text-emerald-600' : 'text-slate-600'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Order Items</h4>
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-bold">Rs. {item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-black pt-2 border-t text-slate-900">
              <span>Grand Total:</span>
              <span className="text-emerald-600">Rs. {order.grandTotal}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <Suspense fallback={<div className="text-center py-20 text-xs font-bold text-slate-400">Loading Order Tracker...</div>}>
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </div>
  );
}
