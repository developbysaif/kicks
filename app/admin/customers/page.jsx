'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Users, Shield, Trash2, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([
    { _id: 'u1', name: 'Kick Admin', email: 'admin@kickhomecare.com', role: 'admin', phone: '+923210009008', createdAt: new Date().toISOString() },
    { _id: 'u2', name: 'Rayyan Ansari', email: 'user@kickhomecare.com', role: 'customer', phone: '+923001234567', createdAt: new Date().toISOString() }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const { data } = await axios.get('/api/admin/customers', { headers, timeout: 4000 });
      if (data && data.success && data.users?.length > 0) {
        setCustomers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Are you sure you want to change user role to ${newRole}?`)) return;
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put('/api/admin/customers', { _id: id, role: newRole }, { headers });
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer account?')) return;
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/api/admin/customers?id=${id}`, { headers });
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Customer Accounts</h1>
        <p className="text-xs text-slate-500">View registered user profiles, permissions, and manage user roles.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2">Contact</th>
              <th className="py-3 px-2">Role</th>
              <th className="py-3 px-2">Registered On</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(c => (
              <tr key={c._id}>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-800 font-extrabold flex items-center justify-center text-sm">
                      {c.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="space-y-0.5 text-slate-600">
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {c.email}</div>
                    {c.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {c.phone}</div>}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleRole(c._id, c.role)}
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase flex items-center gap-1 w-max ${c.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}
                  >
                    <Shield className="w-3 h-3" /> {c.role}
                  </button>
                </td>
                <td className="py-3 px-2 text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
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
    </div>
  );
}
