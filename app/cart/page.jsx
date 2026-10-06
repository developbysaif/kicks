'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* SECTION 1 (WHITE) -> Cart Items & Summary */}
        <section className="bg-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-3xl font-black text-slate-900 mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-slate-800">Your Cart is Empty</h2>
                <p className="text-xs text-slate-500 mt-1 mb-6">Explore our range of shoe care, bleach, and cleaning solutions!</p>
                <Link href="/shop" className="px-6 py-3 bg-[#D0161D] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all inline-block shadow-sm">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Cart Items Table */}
                <div className="lg:col-span-8 bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="divide-y divide-slate-200">
                    {cartItems.map((item) => {
                      const prod = item.product || {};
                      const name = prod.name || item.name || 'Product';
                      const image = prod.images?.[0] || item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';

                      return (
                        <div key={item._id} className="py-4 first:pt-0 flex items-center gap-4">
                          <img src={image} alt={name} className="w-20 h-20 object-contain rounded-2xl bg-white p-2 border border-slate-200 shrink-0" />

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate">{name}</h3>
                            {item.variation && (
                              <span className="text-xs text-slate-500 block mt-0.5">Variant: {item.variation}</span>
                            )}
                            <span className="text-xs font-extrabold text-[#D0161D] block mt-1">Rs. {item.price} each</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden text-xs bg-white">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 font-bold hover:bg-slate-100">-</button>
                            <span className="px-3 font-bold text-slate-800">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 font-bold hover:bg-slate-100">+</button>
                          </div>

                          <div className="text-right font-extrabold text-slate-900 text-sm w-24">
                            Rs. {item.price * item.quantity}
                          </div>

                          <button onClick={() => removeFromCart(item._id)} className="text-slate-400 hover:text-red-600 p-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Box */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3">Order Summary</h3>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-bold text-slate-800">Rs. {subtotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-[#D0161D] font-bold">
                          <span>Coupon Discount:</span>
                          <span>-Rs. {discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping Fee:</span>
                        <span className="font-bold text-slate-800">
                          {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${shippingFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                        <span>Grand Total:</span>
                        <span className="text-[#D0161D]">Rs. {grandTotal}</span>
                      </div>
                    </div>

                    {/* Coupon Form */}
                    <div className="pt-2">
                      {coupon ? (
                        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold">
                          <span className="flex items-center">
                            <Tag className="w-4 h-4 mr-1 text-[#D0161D]" />
                            {coupon.code} (-Rs. {discountAmount})
                          </span>
                          <button onClick={removeCoupon} className="text-red-700 hover:text-red-800 text-xs underline">Remove</button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Coupon (e.g. KICK10)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase outline-none focus:border-[#D0161D]"
                          />
                          <button type="submit" disabled={applying} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
                            Apply
                          </button>
                        </form>
                      )}
                      {couponError && <p className="text-[11px] text-red-600 font-medium mt-1">{couponError}</p>}
                    </div>

                    <Link
                      href={user ? "/checkout" : "/loginb?redirect=/checkout"}
                      className="w-full py-3.5 bg-[#D0161D] hover:bg-red-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2 (RED) -> Value Guarantees */}
        <section className="bg-[#D0161D] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider">
                Shop with Confidence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Kick Customer Commitments
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Every order comes backed by Ibn Khushi's trusted standard of excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Nationwide Delivery', desc: 'Fast, secure parcel dispatch via TCS & PostEx across Pakistan.', icon: '🚚' },
                { title: '100% Genuine Formulas', desc: 'Directly manufactured and bottled by Kick Home Care standards.', icon: '🛡️' },
                { title: '7-Day Easy Returns', desc: 'Hassle-free replacement for any leaking or defective parcel.', icon: '🔄' },
                { title: 'Live WhatsApp Care', desc: 'Direct access to support agents for order queries and tracking.', icon: '💬' }
              ].map((g, idx) => (
                <div
                  key={idx}
                  className="bg-white text-slate-900 rounded-3xl p-6 border border-white/20 shadow-sm space-y-3"
                >
                  <div className="text-3xl">{g.icon}</div>
                  <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
