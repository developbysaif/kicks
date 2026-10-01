import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading Admin Analytics..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time revenue, orders summary, and inventory alerts.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
            <div className="p-2.5 bg-emerald-50 rounded-2xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">Rs. {stats?.totalSales || 0}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Processed Revenue</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="p-2.5 bg-blue-50 rounded-2xl"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{stats?.totalOrders || 0}</span>
          <span className="text-[11px] text-amber-600 font-semibold">{stats?.pendingOrders || 0} Pending Confirmation</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-indigo-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Products</span>
            <div className="p-2.5 bg-indigo-50 rounded-2xl"><Package className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{stats?.totalProducts || 0}</span>
          <span className="text-[11px] text-rose-500 font-semibold">{stats?.lowStockCount || 0} Low Stock Items</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-teal-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customers</span>
            <div className="p-2.5 bg-teal-50 rounded-2xl"><Users className="w-5 h-5" /></div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{stats?.totalCustomers || 0}</span>
          <span className="text-[11px] text-slate-400 font-semibold">Registered Accounts</span>
        </div>

      </div>

      {/* Recent Orders Table & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline">View All →</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stats?.recentOrders?.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900">{o.orderId}</td>
                    <td className="p-2">{o.shippingAddress?.fullName || 'Customer'}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-2 text-right font-black text-slate-900">Rs. {o.grandTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Low Stock Warnings</h3>
          </div>

          <div className="space-y-3">
            {stats?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">All inventory levels healthy!</p>
            ) : (
              stats?.lowStockProducts?.map((p) => (
                <div key={p._id} className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] text-rose-600 font-bold">Only {p.stock} units remaining</span>
                  </div>
                  <Link to={`/admin/products/edit/${p._id}`} className="text-xs font-bold text-emerald-600 hover:underline">
                    Restock
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
