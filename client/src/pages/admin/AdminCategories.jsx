import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import API from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/categories', { name, description, image });
      setCategories(prev => [...prev, data]);
      setName('');
      setDescription('');
      setImage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await API.delete(`/categories/${id}`);
        setCategories(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-900">Create New Category</h3>
          <input type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
          <textarea rows={3} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
          <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs" />
          <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">Add Category</button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-4 space-y-2">
          {categories.map((c) => (
            <div key={c._id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <h4 className="font-bold text-slate-900">{c.name}</h4>
                <p className="text-slate-400">{c.description}</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-rose-600 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
