'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
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

  const handleTrack = useCallback(async (idToSearch) => {
    const id = idToSearch || orderId;
    if (!id || !id.trim()) return;

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
  }, [orderId]);

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId);
    }
  }, [initialId, handleTrack]);

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
    <div className="space-y-0">
      {/* SECTION 1 (WHITE) -> Order Tracking Box & Status */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl text-center">
            <Package className="w-12 h-12 text-[#D0161D] mx-auto mb-3" />
            <h1 className="text-2xl sm:text-3xl font-black">Live Order Tracking</h1>
            <p className="text-xs text-slate-300 mt-1">Enter your Kick Order ID (e.g. KICK-123456) to trace status.</p>

            <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="KICK-XXXXXX"
                aria-label="Enter Kick Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 min-w-0 px-4 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[#D0161D]"
              />
              <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3 bg-[#D0161D] hover:bg-red-800 text-white font-bold rounded-xl text-xs shadow-sm transition">
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 font-bold p-4 rounded-2xl text-xs text-center border border-red-200">
              {errorMsg}
            </div>
          )}

          {order && (
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 pb-4 gap-2">
                <div>
                  <span className="text-xs text-slate-500 block">Order ID</span>
                  <span className="text-lg font-black text-slate-900">{order.orderId}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Status</span>
                  <span className="px-3 py-1 bg-red-100 text-[#D0161D] text-xs font-bold rounded-full">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="py-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Delivery Timeline</h3>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {steps.map((step) => {
                    const state = getStepStatus(step);
                    return (
                      <div key={step} className="flex flex-col items-center space-y-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${state === 'completed' || state === 'current' ? 'bg-[#D0161D] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-400'}`}>
                          {state === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : step.charAt(0)}
                        </div>
                        <span className={`text-[11px] font-bold ${state === 'current' ? 'text-[#D0161D]' : 'text-slate-600'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Order Items</h4>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-bold">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-[#D0161D]">Rs. {order.grandTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2 (RED) -> Order Support Callout */}
      <section className="bg-[#D0161D] text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#D0161D] uppercase tracking-wider">
                Courier Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Need urgent help tracking your package?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
                Our support desk is connected directly with TCS and PostEx tracking portals to expedite your delivery.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#D0161D] hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition"
              >
                WhatsApp Support
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center py-20 text-xs font-bold text-slate-400">Loading Order Tracker...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
