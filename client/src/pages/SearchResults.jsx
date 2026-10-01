import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products?keyword=${encodeURIComponent(query)}&limit=24`);
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900">Search Results for "{query}"</h1>
        <p className="text-xs text-slate-500 mt-1">Found {products.length} products matching your query.</p>
      </div>

      {loading ? (
        <Loader message="Searching catalog..." />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" description={`We couldn't find any products matching "${query}".`} actionText="Browse Catalog" actionLink="/shop" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onQuickView={(prod) => setQuickViewProduct(prod)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
