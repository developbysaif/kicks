import React, { useState } from 'react';
import { Plus, Trash2, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Addresses = () => {
  const { user, saveAddress, deleteAddress } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', addressLine: '', city: 'Lahore', province: 'Punjab', postalCode: '54000', isDefault: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveAddress(formData);
    setShowModal(false);
    setFormData({ fullName: '', phone: '', addressLine: '', city: 'Lahore', province: 'Punjab', postalCode: '54000', isDefault: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Address Book</h1>
          <p className="text-xs text-slate-500 mt-1">Manage delivery locations for quick checkout</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1">
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.addresses?.map((addr) => (
          <div key={addr._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative space-y-2 text-xs">
            {addr.isDefault && (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[10px] inline-block mb-2">
                Default Address
              </span>
            )}
            <h4 className="font-bold text-slate-900">{addr.fullName}</h4>
            <p className="text-slate-500">{addr.phone}</p>
            <p className="text-slate-700 font-medium">{addr.addressLine}, {addr.city}, {addr.province}</p>
            
            <button
              onClick={() => deleteAddress(addr._id)}
              className="mt-4 text-rose-600 hover:underline font-semibold flex items-center space-x-1 text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Address</span>
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Delivery Address</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Full Name" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
              <input type="text" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
              <input type="text" placeholder="Street Address" required value={formData.addressLine} onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="City" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
                <input type="text" placeholder="Province" required value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>
              <div className="flex space-x-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Save Address</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
