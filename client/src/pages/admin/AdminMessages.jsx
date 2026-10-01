import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get('/contact/messages');
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Customer Messages</h1>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 divide-y divide-slate-100">
        {messages.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No customer messages received yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className="py-4 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{m.name} ({m.email})</span>
                <span className="text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-semibold text-emerald-700">Subject: {m.subject}</p>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
