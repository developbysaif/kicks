import { redirect } from 'next/navigation';

export default function LoginBPage({ searchParams }) {
  const query = searchParams && Object.keys(searchParams).length > 0
    ? '?' + new URLSearchParams(searchParams).toString()
    : '';
  redirect(`/login${query}`);
}
