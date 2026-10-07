'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Star,
  Tag,
  MessageSquare,
  Boxes,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
  BookOpen,
  FolderTree,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminAuthGate from '@/components/AdminAuthGate';

const AdminLayout = ({ children }) => {
  const { user, loading, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products Catalog', path: '/admin/products', icon: Package },
    { label: 'Category Management', path: '/admin/categories', icon: Layers },
    { label: 'Subcategories', path: '/admin/subcategories', icon: FolderTree },
    { label: 'Blog Articles', path: '/admin/blogs', icon: BookOpen },
    { label: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { label: 'Customer Accounts', path: '/admin/customers', icon: Users },
    { label: 'Review Moderation', path: '/admin/reviews', icon: Star },
    { label: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { label: 'Contact Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  // 1. Loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="bg-white rounded-3xl p-3 shadow-2xl">
          <img src="/kick%20logo.png" alt="Kick Home Care" className="h-12 w-auto object-contain" />
        </div>
        <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold">
          <RefreshCw className="w-4 h-4 text-red-500 animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // 2. Auth Gate: Show Login / Sign Up if not logged in or not admin
  if (!user || !isAdmin) {
    return <AdminAuthGate />;
  }

  // 3. Authorized Admin UI
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800">
      
      {/* Mobile Top Navbar with Kick Logo */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-40 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-xl p-1 shadow-sm flex items-center justify-center shrink-0">
            <img src="/kick%20logo.png" alt="Kick Home Care" className="h-7 w-auto object-contain" />
          </div>
          <span className="font-black text-sm tracking-wide text-white">KICK ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Admin Sidebar"
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-6">
          
          {/* Sidebar Top: Kick Logo Branding */}
          <Link href="/admin" className="flex items-center space-x-3 border-b border-slate-800 pb-5 group">
            <div className="bg-white rounded-2xl p-2 shadow-md flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:scale-105 transition-transform">
              <img src="/kick%20logo.png" alt="Kick Home Care" className="h-9 w-auto object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-white text-sm tracking-tight truncate">Kick Control</h3>
              <p className="text-[10px] text-red-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all ${isActive ? 'bg-red-600 text-white shadow-md font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-3 text-xs">
          {/* Active Admin Badge */}
          <div className="px-3 py-2 bg-slate-800/70 rounded-xl border border-slate-700/50 text-[11px] text-slate-300">
            <span className="text-slate-400 block text-[10px] font-semibold">Active Administrator:</span>
            <span className="font-bold text-white truncate block">{user?.name || user?.email}</span>
            <span className="text-[10px] text-red-400 font-semibold truncate block">{user?.email}</span>
          </div>

          <Link href="/" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;
