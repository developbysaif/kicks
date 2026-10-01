'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-800">Your Cart is Empty</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">Explore our range of shoe care, bleach, and cleaning solutions!</p>
            <Link href="/shop" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all inline-block">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const prod = item.product || {};
                  const name = prod.name || item.name || 'Product';
                  const image = prod.images?.[0] || item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';

                  return (
                    <div key={item._id} className="py-4 first:pt-0 flex items-center gap-4">
                      <img src={image} alt={name} className="w-20 h-20 object-contain rounded-2xl bg-slate-50 p-2 border border-slate-100 shrink-0" />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{name}</h3>
                        {item.variation && (
                          <span className="text-xs text-slate-400 block mt-0.5">Variant: {item.variation}</span>
                        )}
                        <span className="text-xs font-extrabold text-emerald-600 block mt-1">Rs. {item.price} each</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden text-xs bg-slate-50">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 font-bold hover:bg-slate-200">-</button>
                        <span className="px-3 font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 font-bold hover:bg-slate-200">+</button>
                      </div>

                      <div className="text-right font-extrabold text-slate-900 text-sm w-24">
                        Rs. {item.price * item.quantity}
                      </div>

                      <button onClick={() => removeFromCart(item._id)} className="text-slate-400 hover:text-rose-500 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">Rs. {subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount:</span>
                      <span>-Rs. {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="font-bold text-slate-800">
                      {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `Rs. ${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Grand Total:</span>
                    <span className="text-emerald-600">Rs. {grandTotal}</span>
                  </div>
                </div>

                {/* Coupon Form */}
                <div className="pt-2">
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                      <span className="flex items-center">
                        <Tag className="w-4 h-4 mr-1 text-emerald-600" />
                        {coupon.code} (-Rs. {discountAmount})
                      </span>
                      <button onClick={removeCoupon} className="text-rose-600 hover:text-rose-700 text-xs">Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. KICK10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase outline-none focus:border-emerald-500"
                      />
                      <button type="submit" disabled={applying} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-rose-500 font-medium mt-1">{couponError}</p>}
                </div>

                <Link href="/checkout" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
