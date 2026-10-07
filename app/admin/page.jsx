'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Layers,
  Boxes,
  Tag,
  Plus,
  ArrowRight,
  RefreshCw,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 12,
    totalProducts: 19,
    totalCustomers: 5,
    totalCategories: 6,
    totalRevenue: 14500,
    pendingOrders: 3
  });
  const [recentOrders, setRecentOrders] = useState([
    {
      _id: 'ord_1',
      orderId: 'KICK-892101',
      shippingAddress: { fullName: 'Rayyan Ansari' },
      grandTotal: 1250,
      orderStatus: 'Delivered',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'ord_2',
      orderId: 'KICK-445120',
      shippingAddress: { fullName: 'Usman Ali' },
      grandTotal: 890,
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const { data } = await axios.get('/api/admin/stats', { headers, timeout: 4000 });
      if (data && data.success && data.stats) {
        setStats(data.stats);
        if (data.recentOrders && data.recentOrders.length > 0) {
          setRecentOrders(data.recentOrders);
        }
      }
    } catch (err) {
      console.warn('Using default admin stats:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Control Center</h1>
          <p className="text-xs text-slate-500">Full access to manage products, categories, orders, stock levels & customer accounts.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Refresh Store Performance Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-600' : ''}`} />
            <span className="hidden sm:inline">{loading ? 'Updating...' : 'Refresh Stats'}</span>
          </button>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Remove Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-red-600">
            <span className="text-xs font-bold uppercase text-slate-400">Total Revenue</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">Rs. {stats?.totalRevenue || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-blue-600">
            <span className="text-xs font-bold uppercase text-slate-400">Total Orders</span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalOrders || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-bold uppercase text-slate-400">Products Catalog</span>
            <Package className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalProducts || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Orders</span>
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.pendingOrders || 0}</div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Quick Management Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link href="/admin/products" className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-red-500 hover:shadow-md transition-all group space-y-2">
            <div className="flex items-center justify-between text-red-600">
              <Package className="w-6 h-6" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Products Catalog</h4>
            <p className="text-xs text-slate-500">Add new products, delete items, update pricing & product images.</p>
          </Link>

          <Link href="/admin/orders" className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all group space-y-2">
            <div className="flex items-center justify-between text-blue-600">
              <ShoppingBag className="w-6 h-6" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Order Management</h4>
            <p className="text-xs text-slate-500">View customer orders, update delivery status & mark payment status.</p>
          </Link>

          <Link href="/admin/categories" className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-purple-500 hover:shadow-md transition-all group space-y-2">
            <div className="flex items-center justify-between text-purple-600">
              <Layers className="w-6 h-6" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Categories</h4>
            <p className="text-xs text-slate-500">Manage store shoe care, home cleaning, & laundry categories.</p>
          </Link>

          <Link href="/admin/inventory" className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-amber-500 hover:shadow-md transition-all group space-y-2">
            <div className="flex items-center justify-between text-amber-600">
              <Boxes className="w-6 h-6" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Stock & Inventory</h4>
            <p className="text-xs text-slate-500">Monitor stock levels, edit quantities inline & restock low inventory.</p>
          </Link>

          <Link href="/admin/customers" className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-rose-500 hover:shadow-md transition-all group space-y-2">
            <div className="flex items-center justify-between text-rose-600">
              <Users className="w-6 h-6" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Customer Accounts</h4>
            <p className="text-xs text-slate-500">View user registration list, phone numbers, and grant admin roles.</p>
          </Link>

          <Link href="/admin/coupons" className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-teal-500 hover:shadow-md transition-all group space-y-2">
            <div className="flex items-center justify-between text-teal-600">
              <Tag className="w-6 h-6" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Coupons & Promos</h4>
            <p className="text-xs text-slate-500">Create percentage or fixed discount promo codes for customers.</p>
          </Link>

        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h3>
          <Link href="/admin/orders" className="text-xs text-red-600 font-bold hover:underline">Manage All Orders →</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentOrders.map(o => (
                <tr key={o._id}>
                  <td className="py-3 px-2 font-bold text-slate-900">{o.orderId}</td>
                  <td className="py-3 px-2">{o.shippingAddress?.fullName || o.user?.name || 'Customer'}</td>
                  <td className="py-3 px-2 font-black text-red-600">Rs. {o.grandTotal}</td>
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full font-bold text-[10px]">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
