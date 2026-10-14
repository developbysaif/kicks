import { redirect } from 'next/navigation';

export default function AdminLoginPage({ searchParams }) {
  const query = searchParams && Object.keys(searchParams).length > 0
    ? '?' + new URLSearchParams({ ...searchParams, role: 'admin' }).toString()
    : '?role=admin&redirect=/admin';
  redirect(`/login${query}`);
}
