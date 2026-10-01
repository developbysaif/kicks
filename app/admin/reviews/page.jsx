'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([
    { _id: 'rv1', product: { name: 'Kick Whito - White Sneaker Cleaner' }, userName: 'Rayyan Ansari', rating: 5, comment: 'Kick Whito worked like magic on my white sneakers! 5 stars.', isApproved: true },
    { _id: 'rv2', product: { name: 'Kick Bleach Liquid Ultra Clean 500ml' }, userName: 'Saman Malik', rating: 5, comment: 'Best liquid bleach in Pakistan. Highly recommend!', isApproved: true }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const { data } = await axios.get('/api/admin/reviews', { headers, timeout: 4000 });
      if (data && data.success && data.reviews?.length > 0) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (review) => {
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put('/api/admin/reviews', { _id: review._id, isApproved: !review.isApproved }, { headers });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/api/admin/reviews?id=${id}`, { headers });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Review Moderation</h1>
        <p className="text-xs text-slate-500">Approve or remove customer reviews and product ratings.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
              <th className="py-3 px-2">Product</th>
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2">Rating</th>
              <th className="py-3 px-2">Comment</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {reviews.map(r => (
              <tr key={r._id}>
                <td className="py-3 px-2 font-bold text-slate-900 max-w-xs truncate">{r.product?.name || 'Product'}</td>
                <td className="py-3 px-2 text-slate-700 font-semibold">{r.userName}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-2 text-slate-600 max-w-sm">{r.comment}</td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleApproval(r)}
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${r.isApproved ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}
                  >
                    {r.isApproved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {r.isApproved ? 'Approved' : 'Pending'}
                  </button>
                </td>
                <td className="py-3 px-2 text-right">
                  <button onClick={() => handleDelete(r._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg">
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
