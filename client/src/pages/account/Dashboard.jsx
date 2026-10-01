import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin, User as UserIcon, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
  const completedCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black">Hello, {user?.name}!</h1>
          <p className="text-xs text-slate-300 mt-1">{user?.email} • Customer Account</p>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-semibold transition-colors">
          Logout
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="flex space-x-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs font-bold text-slate-600">
        <Link to="/account" className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl">Overview</Link>
        <Link to="/account/orders" className="px-4 py-2 hover:bg-slate-100 rounded-xl">My Orders</Link>
        <Link to="/account/addresses" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Addresses</Link>
        <Link to="/account/profile" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Profile Settings</Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><ShoppingBag className="w-6 h-6" /></div>
          <div>
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
            <span className="text-xs text-slate-500 block font-medium">Total Orders</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
          <div>
            <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
            <span className="text-xs text-slate-500 block font-medium">In Progress</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <span className="text-2xl font-black text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-500 block font-medium">Delivered Orders</span>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
          <Link to="/account/orders" className="text-xs font-bold text-emerald-600 hover:underline">View All Orders →</Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No orders placed yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 3).map((o) => (
              <div key={o._id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900">{o.orderId}</span>
                  <span className="text-slate-400 block">{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-full">{o.orderStatus}</span>
                <span className="font-black text-slate-900">Rs. {o.grandTotal}</span>
                <Link to={`/account/orders/${o._id}`} className="text-emerald-600 font-bold hover:underline">Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
