'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ProductForm from '@/components/admin/ProductForm';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params?.id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const res = await axios.get(`/api/admin/products/${params.id}`, { headers });
        if (res.data?.success && res.data.product) {
          setProduct(res.data.product);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id, user]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-xs font-bold text-slate-500">Loading product data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4 my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not find the requested product.'}</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
