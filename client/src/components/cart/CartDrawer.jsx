import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
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

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100">
          
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Your Cart</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {cartItems.reduce((c, i) => c + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-6 flex-1 overflow-y-auto divide-y divide-slate-100 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">Your shopping cart is empty.</p>
                <p className="text-xs text-slate-400 mt-1">Explore our range of cleaning & shoe care essentials!</p>
                <Link
                  to="/shop"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-6 inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                >
                  Start Shopping Now
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const prod = item.product || {};
                const name = prod.name || item.name || 'Product';
                const image = prod.images?.[0] || item.image || '/images/products/placeholder.webp';

                return (
                  <div key={item._id} className="pt-4 first:pt-0 flex space-x-4">
                    <img src={image} alt={name} className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0" />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{name}</h4>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.variation && (
                          <span className="text-[11px] text-slate-400 block font-medium mt-0.5">Variant: {item.variation}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity picker */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 font-semibold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900">
                          Rs. {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              
              {/* Coupon input */}
              <div className="space-y-1">
                {coupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <span className="flex items-center font-bold">
                      <Tag className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Coupon Code: {coupon.code} (-Rs. {discountAmount})
                    </span>
                    <button onClick={removeCoupon} className="text-rose-600 hover:text-rose-700 text-xs font-semibold">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter promo coupon (e.g. KICK10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 uppercase"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">Rs. {subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-Rs. {discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-slate-800">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-emerald-600">Rs. {grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
                >
                  View Full Cart Details
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
