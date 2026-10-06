import ProductForm from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Add New Product | Kick Admin',
  description: 'Create a new catalog product'
};

export default function NewProductPage() {
  return <ProductForm isEdit={false} />;
}
