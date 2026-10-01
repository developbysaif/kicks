import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import API from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(500);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get('/coupons');
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/coupons', {
        code, discountType, discountValue: Number(discountValue), minOrderAmount: Number(minOrderAmount), expiryDate
      });
      setCoupons(prev => [data, ...prev]);
      setCode('');
    } catch (err) {
      alert(err.response?.data?.message || 'Create coupon failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete coupon?')) {
      try {
        await API.delete(`/coupons/${id}`);
        setCoupons(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Discount Coupons</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 h-fit text-xs">
          <h3 className="text-sm font-bold text-slate-900">Create Promo Code</h3>
          <input type="text" placeholder="CODE (e.g. SAVE20)" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full p-2.5 bg-slate-50 border rounded-xl uppercase" />
          <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
            <option value="percentage">Percentage Off (%)</option>
            <option value="fixed">Fixed Amount (PKR)</option>
          </select>
          <input type="number" placeholder="Discount Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          <input type="number" placeholder="Min Order PKR" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} required className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold">Save Coupon</button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-4 space-y-2">
          {coupons.map((c) => (
            <div key={c._id} className="flex justify-between items-center p-3.5 hover:bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="font-black text-slate-900 text-sm tracking-wider uppercase">{c.code}</span>
                <span className="text-slate-500 block">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} OFF`} (Min Order: Rs. {c.minOrderAmount})
                </span>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-rose-600 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
