import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, Check, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading order details..." />;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentIdx = statuses.indexOf(order.orderStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order #{order.orderId}</h1>
          <p className="text-xs text-slate-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Link to="/account/orders" className="text-xs font-bold text-emerald-600 hover:underline">← Back to Orders</Link>
      </div>

      {/* Tracking Progress Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900">Order Progress Tracker</h3>
        
        {order.orderStatus === 'Cancelled' ? (
          <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>This order was cancelled. Restocked into inventory.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
            {statuses.map((st, idx) => {
              const isDone = idx <= currentIdx;
              return (
                <div key={st} className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isDone ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                    {isDone ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{st}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tracking Logs */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase">Activity Log</h4>
          {order.trackingHistory?.map((h, i) => (
            <div key={i} className="text-xs text-slate-600 flex justify-between py-1">
              <span><strong>{h.status}:</strong> {h.comment}</span>
              <span className="text-slate-400">{new Date(h.updatedAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items & Address Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Ordered Items</h3>
          <div className="divide-y divide-slate-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1" />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    {item.variation && <span className="text-slate-400">Variant: {item.variation}</span>}
                  </div>
                </div>
                <span className="font-extrabold text-slate-900">{item.quantity} x Rs. {item.price} = Rs. {item.quantity * item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Payment Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-xs text-slate-700">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Shipping & Payment</h3>
          <div>
            <span className="font-bold text-slate-900 block">Recipient:</span>
            <p>{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
            <p className="mt-1">{order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.province}</p>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-900 block">Payment Method:</span>
            <p>{order.paymentMethod} ({order.paymentStatus})</p>
          </div>
          <div className="pt-2 border-t border-slate-100 font-extrabold text-slate-900 text-sm flex justify-between">
            <span>Total Paid:</span>
            <span className="text-emerald-600">Rs. {order.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
