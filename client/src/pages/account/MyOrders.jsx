import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders/myorders');
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading your orders..." />;

  if (orders.length === 0) {
    return <EmptyState title="No Orders Found" description="You haven't placed any orders yet." actionText="Shop Now" actionLink="/shop" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Track and manage your order history</p>
        </div>
        <Link to="/account" className="text-xs font-bold text-emerald-600 hover:underline">← Dashboard</Link>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-slate-900">{o.orderId}</span>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${o.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : o.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                  {o.orderStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400">Placed on: {new Date(o.createdAt).toLocaleString()}</p>
              <p className="text-xs text-slate-600 font-medium">{o.orderItems.length} Items ({o.orderItems.map(i => i.name).join(', ')})</p>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-base font-black text-slate-900">Rs. {o.grandTotal}</span>
              <Link
                to={`/account/orders/${o._id}`}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Track Order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
