import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminProductEdit = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    price: '',
    salePrice: '',
    stock: 100,
    sku: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ''
  });

  const [variations, setVariations] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data || []);
      if (data && data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        category: data.category?._id || data.category || '',
        images: data.images?.length > 0 ? data.images : [''],
        price: data.price || '',
        salePrice: data.salePrice || '',
        stock: data.stock || 100,
        sku: data.sku || '',
        isFeatured: Boolean(data.isFeatured),
        isBestSeller: Boolean(data.isBestSeller),
        isNewArrival: Boolean(data.isNewArrival),
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : ''
      });
      setVariations(data.variations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddVariationOption = () => {
    if (variations.length === 0) {
      setVariations([{ title: 'Option', options: [{ name: '500ml', price: Number(formData.price) || 250, salePrice: 0, stock: 50, sku: `${formData.sku}-500` }] }]);
    } else {
      const copy = [...variations];
      copy[0].options.push({ name: '1 Litre', price: (Number(formData.price) || 250) * 1.5, salePrice: 0, stock: 50, sku: `${formData.sku}-1000` });
      setVariations(copy);
    }
  };

  const handleRemoveOption = (optIdx) => {
    const copy = [...variations];
    copy[0].options.splice(optIdx, 1);
    setVariations(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      salePrice: Number(formData.salePrice) || 0,
      stock: Number(formData.stock),
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      variations
    };

    try {
      if (isEdit) {
        await API.put(`/products/${id}`, payload);
      } else {
        await API.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading Product Details..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/admin/products" className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-xl border">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:border-emerald-500 font-semibold" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold outline-none focus:border-emerald-500">
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SKU *</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none font-mono" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Regular Price (PKR) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Discounted Sale Price (PKR)</label>
            <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Stock Level *</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
            <input type="text" value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Description *</label>
          <textarea rows={4} name="description" value={formData.description} onChange={handleChange} required className="w-full p-3.5 bg-slate-50 border rounded-xl text-xs outline-none" />
        </div>

        <div className="flex space-x-6 text-xs font-bold text-slate-700">
          <label className="flex items-center space-x-2"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /><span>Featured</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} /><span>Best Seller</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} /><span>New Arrival</span></label>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Product'}</span>
        </button>
      </form>
    </div>
  );
};

export default AdminProductEdit;
