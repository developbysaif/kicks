'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminInventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([
    { _id: 'p1', name: 'Kick Whito - White Sneaker Cleaner', sku: 'KICK-WHITO-100', stock: 150, category: { name: 'Shoe Care' }, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'] },
    { _id: 'p2', name: 'Kick Bleach Liquid Ultra Clean 500ml', sku: 'KICK-BLC-500', stock: 150, category: { name: 'Laundry Care' }, images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'] },
    { _id: 'p3', name: 'Kick Dish Wash Liquid Lemon Fresh', sku: 'KICK-DISH-500', stock: 140, category: { name: 'Dish Care' }, images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'] }
  ]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [stockInputs, setStockInputs] = useState({ p1: 150, p2: 150, p3: 140 });

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products', { timeout: 4000 });
      if (data && data.success && data.products?.length > 0) {
        setProducts(data.products);
        const map = {};
        data.products.forEach(p => { map[p._id] = p.stock; });
        setStockInputs(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleStockChange = (id, value) => {
    setStockInputs(prev => ({ ...prev, [id]: value }));
  };

  const saveStock = async (id) => {
    try {
      setUpdatingId(id);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const newStock = Number(stockInputs[id]);
      const { data } = await axios.put('/api/admin/inventory', { _id: id, stock: newStock }, { headers });
      if (data.success) {
        setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Inventory & Stock Control</h1>
        <p className="text-xs text-slate-500">Monitor warehouse product stock levels, adjust quantities, and restock low inventory items.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
              <th className="py-3 px-2">Product</th>
              <th className="py-3 px-2">SKU</th>
              <th className="py-3 px-2">Current Stock</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => {
              const currentStock = p.stock;
              const isLow = currentStock <= 10;
              const isOut = currentStock === 0;

              return (
                <tr key={p._id}>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border" />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.category?.name || 'Item'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-500">{p.sku}</td>
                  <td className="py-3 px-2 font-black text-slate-900">{currentStock} units</td>
                  <td className="py-3 px-2">
                    {isOut ? (
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <CheckCircle className="w-3 h-3" /> In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        min="0"
                        value={stockInputs[p._id] !== undefined ? stockInputs[p._id] : p.stock}
                        onChange={(e) => handleStockChange(p._id, e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                      />
                      <button
                        onClick={() => saveStock(p._id)}
                        disabled={updatingId === p._id}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
