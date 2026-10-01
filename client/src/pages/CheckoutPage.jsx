import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, discountAmount, shippingFee, grandTotal, coupon, clearCart } = useCart();

  const savedAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0] || {};

  const [formData, setFormData] = useState({
    fullName: savedAddr.fullName || user?.name || '',
    phone: savedAddr.phone || user?.phone || '',
    addressLine: savedAddr.addressLine || '',
    city: savedAddr.city || 'Lahore',
    province: savedAddr.province || 'Punjab',
    postalCode: savedAddr.postalCode || '54000',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.city) {
      setErrorMsg('Please complete all required shipping fields');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.product._id || item.product,
          name: item.product.name || item.name || 'Product',
          image: item.product.images?.[0] || '/images/products/placeholder.webp',
          price: item.price,
          quantity: item.quantity,
          variation: item.variation,
          sku: item.product.sku || 'SKU'
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: 'Pakistan'
        },
        paymentMethod,
        subtotal,
        discount: discountAmount,
        shippingFee,
        grandTotal,
        couponCode: coupon?.code || '',
        notes: formData.notes
      };

      const { data } = await API.post('/orders', orderPayload);
      clearCart();
      navigate(`/account/orders/${data._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Provide your shipping details for Cash on Delivery dispatch.</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">1. Shipping Address</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Street Address *</label>
              <input
                type="text"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                placeholder="House number, street name, sector..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Province *</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">2. Payment Method</h3>
            <div className="p-4 border-2 border-emerald-600 bg-emerald-50/50 rounded-2xl flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                <span className="text-[11px] text-slate-500">Pay cash upon delivery at your doorstep across Pakistan.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Items ({cartItems.length})</h3>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-2">
            {cartItems.map((item) => {
              const prod = item.product || {};
              return (
                <div key={item._id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{prod.name}</span>
                    <span className="text-slate-400 block">Qty: {item.quantity} {item.variation && `(${item.variation})`}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">Rs. {item.price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between"><span>Subtotal:</span><span>Rs. {subtotal}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount:</span><span>-Rs. {discountAmount}</span></div>}
            <div className="flex justify-between"><span>Shipping Fee:</span><span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span></div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>Total Payable:</span>
              <span className="text-emerald-600">Rs. {grandTotal}</span>
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
