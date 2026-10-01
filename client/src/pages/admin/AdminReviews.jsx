import React, { useEffect, useState } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import API from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/reviews/admin');
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await API.put(`/reviews/${id}/status`, { isApproved: !currentStatus });
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: data.isApproved } : r));
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete review?')) {
      try {
        await API.delete(`/reviews/${id}`);
        setReviews(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Review Moderation</h1>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-4 divide-y divide-slate-100">
        {reviews.map((r) => (
          <div key={r._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900">{r.userName}</span>
                <span className="text-slate-400">on {r.product?.name}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 font-medium">"{r.comment}"</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleStatus(r._id, r.isApproved)}
                className={`px-3 py-1.5 rounded-xl font-bold ${r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}
              >
                {r.isApproved ? 'Approved' : 'Approve'}
              </button>
              <button onClick={() => handleDelete(r._id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
