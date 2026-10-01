import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, email, phone, password: password || undefined });
    if (res.success) {
      setMsg('Profile updated successfully!');
      setPassword('');
    } else {
      setMsg(res.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Profile Settings</h1>

      {msg && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">{msg}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">New Password (leave blank to keep current)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
        </div>

        <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
          Save Profile Updates
        </button>
      </form>
    </div>
  );
};

export default Profile;
