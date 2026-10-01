import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, CheckCircle } from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/admin?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
        comment: `Admin updated status to ${newStatus}`
      });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order Fulfillment & Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">Update customer order statuses and payment confirmations.</p>
        </div>

        <div className="flex space-x-2">
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === st ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader message="Loading orders..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">City & Phone</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{o.orderId}</td>
                    <td className="p-4">{o.shippingAddress?.fullName}</td>
                    <td className="p-4 text-slate-500">{o.shippingAddress?.city} ({o.shippingAddress?.phone})</td>
                    <td className="p-4 font-black text-slate-900">Rs. {o.grandTotal}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${o.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : o.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
