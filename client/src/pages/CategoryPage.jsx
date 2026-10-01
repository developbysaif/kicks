import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        API.get(`/categories/${slug}`),
        API.get(`/products?category=${slug}&limit=24`)
      ]);
      setCategory(catRes.data);
      setProducts(prodRes.data?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen message="Loading category..." />;

  if (!category) return <EmptyState title="Category Not Found" actionText="Back to Shop" actionLink="/shop" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative z-10 max-w-2xl space-y-2">
          <Link to="/shop" className="text-xs font-bold text-emerald-400 hover:underline">← Shop All Categories</Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{category.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <EmptyState title="No products in this category yet." actionText="Explore Other Products" actionLink="/shop" />
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

export default CategoryPage;
