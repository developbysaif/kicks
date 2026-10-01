import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await API.get('/admin/customers');
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const { data } = await API.put(`/admin/customers/${id}/block`);
      setCustomers(prev => prev.map(c => c._id === id ? { ...c, isBlocked: data.isBlocked } : c));
    } catch (err) {
      alert(err.response?.data?.message || 'Block toggle failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Customer Accounts</h1>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {customers.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${c.isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {c.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleBlock(c._id)}
                    className={`px-3 py-1 rounded-xl font-bold text-xs ${c.isBlocked ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}
                  >
                    {c.isBlocked ? 'Unblock' : 'Block Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
