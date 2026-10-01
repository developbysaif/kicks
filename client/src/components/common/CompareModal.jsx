import React from 'react';
import { X, Trash2, ShoppingBag, Star, Check, AlertCircle } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';

const CompareModal = () => {
  const { compareItems, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();
  const { addToCart } = useCart();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Compare Products</h3>
            <p className="text-xs text-slate-500">Side-by-side specs comparison for home care decisions</p>
          </div>
          <div className="flex items-center space-x-3">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-x-auto flex-1">
          {compareItems.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No products added for comparison.</p>
              <p className="text-xs text-slate-400 mt-1">Click the comparison icon on any product card to compare specs!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase w-32 border-b">Feature</th>
                  {compareItems.map(item => (
                    <th key={item._id} className="p-3 border-b min-w-[180px] align-top">
                      <div className="relative group">
                        <button
                          onClick={() => removeFromCompare(item._id)}
                          className="absolute -top-2 -right-2 p-1 bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={item.images?.[0] || '/images/products/placeholder.webp'}
                          alt={item.name}
                          className="w-24 h-24 object-contain rounded-xl bg-slate-50 mx-auto mb-2"
                        />
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 text-center">{item.name}</h4>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Price</td>
                  {compareItems.map(item => (
                    <td key={item._id} className="p-3 font-extrabold text-slate-900">
                      Rs. {item.salePrice > 0 ? item.salePrice : item.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Category</td>
                  {compareItems.map(item => (
                    <td key={item._id} className="p-3 font-medium text-emerald-700">
                      {item.category?.name || 'Home Care'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Rating</td>
                  {compareItems.map(item => (
                    <td key={item._id} className="p-3">
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.rating || 5.0}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Stock Status</td>
                  {compareItems.map(item => (
                    <td key={item._id} className="p-3">
                      {item.stock > 0 ? (
                        <span className="inline-flex items-center text-emerald-600 font-medium">
                          <Check className="w-3.5 h-3.5 mr-1" /> In Stock
                        </span>
                      ) : (
                        <span className="text-rose-500 font-medium">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Variations</td>
                  {compareItems.map(item => (
                    <td key={item._id} className="p-3 text-slate-600">
                      {item.hasVariations ? 'Available' : 'Single Option'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Action</td>
                  {compareItems.map(item => (
                    <td key={item._id} className="p-3">
                      <button
                        onClick={() => addToCart(item, '', 1)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
