'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, subtotal, discountAmount, shippingFee, grandTotal, coupon, clearCart } = useCart();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
          <Link href="/shop" className="mt-4 inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs">
            Return to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

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
            Thank you for ordering with Kick Home Care. Your order ID is <strong className="text-emerald-600 font-extrabold">{orderSuccess.orderId}</strong>.
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
              <span className="font-bold text-slate-800 text-right">{orderSuccess.shippingAddress?.addressLine}, {orderSuccess.shippingAddress?.city}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Link href={`/track-order?orderId=${orderSuccess.orderId}`} className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
              Track Order Live
            </Link>
            <Link href="/shop" className="px-6 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city) {
      setErrorMsg('Please fill in all required shipping address fields');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const orderItems = cartItems.map(item => ({
        product: item.product._id || item.product,
        name: item.product.name || item.name,
        image: item.product.images?.[0] || item.image || '',
        price: item.price,
        quantity: item.quantity,
        variation: item.variation || ''
      }));

      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

      const { data } = await axios.post('/api/orders', {
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
      }, { headers });

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout — Cash on Delivery</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Shipping & Delivery Details</span>
            </h2>

            {errorMsg && <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">{errorMsg}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Complete House Address *</label>
              <input
                type="text"
                required
                placeholder="House #, Street #, Sector / Area"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Province *</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Delivery Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Call before arrival..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Payment Info Box */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-extrabold text-emerald-900">Cash on Delivery (COD)</h4>
                <p className="text-[11px] text-emerald-700">Pay full amount in cash when courier delivers parcel to your doorstep.</p>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b pb-3">Items Summary</h3>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="py-2.5 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{item.product?.name || item.name}</span>
                      <span className="text-slate-400 block">Qty: {item.quantity} {item.variation && `(${item.variation})`}</span>
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
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all"
              >
                {loading ? 'Processing Order...' : 'Confirm Cash on Delivery Order'}
              </button>
            </div>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}
