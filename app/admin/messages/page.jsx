'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      _id: 'm1',
      name: 'Usman Ali',
      email: 'usman@gmail.com',
      phone: '+923001234567',
      subject: 'Inquiry about Kick Whito stock',
      message: 'Hello, I want to know if Kick Whito sneaker cleaner is available for bulk order in Lahore?',
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const { data } = await axios.get('/api/contact', { headers, timeout: 4000 });
      if (data && data.success && data.messages?.length > 0) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Contact Form Messages</h1>
        <p className="text-xs text-slate-500">Inquiries and feedback submitted by users via the Help & Contact page.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-xs font-bold text-slate-400">
            No contact messages received yet.
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={m._id || idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
                    {m.name?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{m.name}</h3>
                    <p className="text-xs text-red-600 font-bold">{m.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(m.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {m.email}</span>
                {m.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {m.phone}</span>}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                {m.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
