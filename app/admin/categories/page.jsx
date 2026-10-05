'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([
    { _id: 'c1', name: 'Shoe Care', slug: 'shoe-care', description: 'Premium shoe shiners, sneaker cleaners, polish sponges & shoe wax.', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' },
    { _id: 'c2', name: 'Laundry Care', slug: 'laundry-care', description: 'Bleach liquid, fabric blue whiteners & conditioners.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80' },
    { _id: 'c3', name: 'Home Cleaning', slug: 'home-cleaning', description: 'Surface cleaners, bathroom sprays & toilet power gels.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
    { _id: 'c4', name: 'Dish Care', slug: 'dish-care', description: 'Lemon dishwashing liquids & heavy duty dish sponges.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80' },
    { _id: 'c5', name: 'Washroom Cleaning', slug: 'washroom-cleaning', description: 'Fast acting liquid drain openers, bathroom cleaners & toilet gels.', image: '/washroom cleaning.png' },
    { _id: 'c6', name: 'Mosquito Protection', slug: 'mosquito-protection', description: 'Electric liquid mosquito repellents, skin lotions & sprays.', image: '/mosquito protection.png' }
  ]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories', { timeout: 4000 });
      if (data && data.success && data.categories?.length > 0) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImage('');
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditingId(c._id);
    setName(c.name);
    setDescription(c.description || '');
    setImage(c.image || '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const payload = {
        name,
        description,
        image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
      };

      if (editingId) {
        payload._id = editingId;
        await axios.put('/api/admin/categories', payload, { headers });
      } else {
        await axios.post('/api/admin/categories', payload, { headers });
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/api/admin/categories?id=${id}`, { headers });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500">Organize store items, add new product categories, and manage banners.</p>
        </div>

        <button onClick={openCreateModal} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Slug</th>
              <th className="py-3 px-2">Description</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {categories.map(c => (
              <tr key={c._id}>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded-lg bg-slate-50 border" />
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 font-mono text-slate-500">{c.slug}</td>
                <td className="py-3 px-2 text-slate-600 max-w-xs truncate">{c.description || 'N/A'}</td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button onClick={() => openEditModal(c)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900">{editingId ? 'Edit Category' : 'Add New Category'}</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" placeholder="https://..." />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
