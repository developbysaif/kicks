import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await API.put(`/products/${id}`, { stock: Number(newStock) });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: Number(newStock) } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <Loader message="Loading inventory stock levels..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Inventory Tracking</h1>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
              <th className="p-4">Product Name</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Price</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4 text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{p.name}</td>
                <td className="p-4 font-mono text-slate-500">{p.sku}</td>
                <td className="p-4 font-extrabold text-slate-900">Rs. {p.price}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${p.stock <= 10 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4 text-right">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => handleStockUpdate(p._id, e.target.value)}
                    className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
