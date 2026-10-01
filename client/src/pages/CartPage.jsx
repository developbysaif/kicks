import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await applyCoupon(couponCode.trim());
  };

  if (cartItems.length === 0) {
    return <EmptyState title="Your Shopping Cart is Empty" description="Looks like you haven't added any products yet." actionText="Continue Shopping" actionLink="/shop" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-black text-slate-900">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm divide-y divide-slate-100">
            {cartItems.map((item) => {
              const prod = item.product || {};
              return (
                <div key={item._id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                  <img
                    src={prod.images?.[0] || '/images/products/placeholder.webp'}
                    alt={prod.name}
                    className="w-20 h-20 object-contain rounded-2xl bg-slate-50 p-2 border border-slate-100 shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{prod.name}</h3>
                    {item.variation && <span className="text-xs text-slate-400">Variant: {item.variation}</span>}
                    <div className="text-xs font-semibold text-emerald-600 mt-1">Rs. {item.price} each</div>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 font-bold">-</button>
                    <span className="px-3 font-semibold text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 font-bold">+</button>
                  </div>

                  <span className="text-sm font-extrabold text-slate-900 w-24 text-right">Rs. {item.price * item.quantity}</span>

                  <button onClick={() => removeFromCart(item._id)} className="text-slate-400 hover:text-rose-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button onClick={clearCart} className="text-xs font-semibold text-rose-600 hover:underline">
              Clear Shopping Cart
            </button>
            <Link to="/shop" className="text-xs font-semibold text-emerald-600 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>
          
          {/* Coupon Form */}
          {coupon ? (
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800">
              <span>Coupon {coupon.code} Applied</span>
              <button onClick={removeCoupon} className="text-rose-600 hover:underline">Remove</button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl">Apply</button>
              </div>
              {couponError && <p className="text-xs text-rose-500 font-medium">{couponError}</p>}
            </form>
          )}

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between"><span>Subtotal:</span><span className="font-bold text-slate-900">Rs. {subtotal}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount:</span><span>-Rs. {discountAmount}</span></div>}
            <div className="flex justify-between"><span>Shipping Fee:</span><span className="font-bold text-slate-900">{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span></div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>Grand Total:</span>
              <span className="text-emerald-600">Rs. {grandTotal}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-2xl text-xs font-bold shadow-md transition-all block"
          >
            Proceed to Checkout
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
