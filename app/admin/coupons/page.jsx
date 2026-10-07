'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Plus, Tag, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([
    { _id: 'cp1', code: 'KICK10', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, expiryDate: new Date('2027-12-31').toISOString(), isActive: true },
    { _id: 'cp2', code: 'WELCOME50', discountType: 'fixed', discountValue: 50, minOrderAmount: 300, expiryDate: new Date('2027-12-31').toISOString(), isActive: true }
  ]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('500');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const { data } = await axios.get('/api/admin/coupons', { headers, timeout: 4000 });
      if (data && data.success && data.coupons?.length > 0) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinOrderAmount('500');
    setExpiryDate('2027-12-31');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const payload = {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        expiryDate: new Date(expiryDate),
        isActive: true
      };

      await axios.post('/api/admin/coupons', payload, { headers });
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const toggleActive = async (coupon) => {
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put('/api/admin/coupons', { _id: coupon._id, isActive: !coupon.isActive }, { headers });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/api/admin/coupons?id=${id}`, { headers });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coupons & Promos</h1>
          <p className="text-xs text-slate-500">Create promotional discount codes for checkout discounts.</p>
        </div>

        <button onClick={openModal} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
              <th className="py-3 px-2">Coupon Code</th>
              <th className="py-3 px-2">Discount</th>
              <th className="py-3 px-2">Min Order</th>
              <th className="py-3 px-2">Expiry</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {coupons.map(c => (
              <tr key={c._id}>
                <td className="py-3 px-2 font-mono font-black text-red-600 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4" /> {c.code}
                </td>
                <td className="py-3 px-2 font-bold text-slate-900">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} OFF`}
                </td>
                <td className="py-3 px-2 text-slate-600">Rs. {c.minOrderAmount}</td>
                <td className="py-3 px-2 text-slate-500">{new Date(c.expiryDate).toLocaleDateString()}</td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${c.isActive ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {c.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="py-3 px-2 text-right">
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900">Create New Coupon Code</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono uppercase" placeholder="KICK20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type *</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Value *</label>
                  <input type="number" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" placeholder="10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Order Amount (Rs.)</label>
                  <input type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
