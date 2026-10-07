'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Truck,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';

const FALLBACK_CATEGORIES = [
  { name: 'Shoe Care', slug: 'shoe-care' },
  { name: 'Laundry Care', slug: 'laundry-care' },
  { name: 'Home Cleaning', slug: 'home-cleaning' },
  { name: 'Dish Care', slug: 'dish-care' },
  { name: 'Washroom Cleaning', slug: 'washroom-cleaning' },
  { name: 'Mosquito Protection', slug: 'mosquito-protection' }
];

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdown(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu & suggestion popups
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowSuggestions(false);
        setCategoriesDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const { data } = await axios.get(`/api/products?search=${encodeURIComponent(searchQuery)}`);
          if (data.success && Array.isArray(data.products)) {
            setSuggestions(data.products.slice(0, 5));
            setShowSuggestions(true);
          }
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 border-b border-gray-100 shadow-xs">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-1.5 px-4 text-xs font-medium text-gray-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Announcement */}
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold text-gray-700 text-[11px] sm:text-xs">Free Delivery on Orders Above Rs. 2,500</span>
          </div>

          {/* Right Utility Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-gray-600">
            <Link href="/track-order" className="hover:text-red-600 transition-colors">
              Track Order
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/contact" className="hover:text-red-600 transition-colors">
              Help
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/contact" className="hover:text-red-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row (Logo, Search, Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="lg:hidden p-2 text-gray-700 hover:text-red-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-col group" aria-label="Kick Home Care Home">
          <img src="/kick%20logo.png" alt="KICK Home Care" className="h-12 sm:h-14 w-auto object-contain" />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-5 pr-14 bg-gray-50 text-gray-800 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
              aria-label="Search products"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Auto Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              {suggestions.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p.slug}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center space-x-3 p-3 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <img
                    src={p.images?.[0] || '/kick.jpeg'}
                    alt={p.name}
                    className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-red-600 font-extrabold">Rs. {p.salePrice || p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User Action Buttons */}
        <div className="flex items-center space-x-5 text-gray-700">
          
          {/* Account Link */}
          {user ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-red-600 text-white rounded-full text-[11px] font-extrabold transition-all shadow-sm flex items-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Admin Panel
                </Link>
              )}
              <Link
                href={isAdmin ? '/admin' : '/account'}
                className="flex items-center space-x-1.5 hover:text-red-600 transition-colors text-xs font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Logout"
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 hover:text-red-600 transition-colors text-xs font-bold"
            >
              <UserIcon className="w-5 h-5 text-gray-700" />
              <span className="hidden sm:inline">Login / Register</span>
            </Link>
          )}

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist with ${wishlistCount} items`}
            className="relative p-1.5 hover:text-red-600 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-6 h-6 text-gray-700 hover:text-red-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
              {wishlistCount}
            </span>
          </Link>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Shopping cart with ${itemCount} items`}
            className="relative p-1.5 hover:text-red-600 transition-colors flex items-center"
            title="Cart"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-red-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Bar Links */}
      <nav className="border-t border-gray-100 hidden lg:block bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
          
          {/* Home Link */}
          <Link
            href="/"
            className={`py-3.5 border-b-2 transition-colors ${
              pathname === '/'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            Home
          </Link>

          {/* Shop Link */}
          <Link
            href="/shop"
            className={`py-3.5 border-b-2 transition-colors ${
              pathname === '/shop'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            Shop
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative py-3.5 cursor-pointer group"
            onMouseEnter={() => setCategoriesDropdown(true)}
            onMouseLeave={() => setCategoriesDropdown(false)}
          >
            <div className={`flex items-center space-x-1 transition-colors ${
              pathname === '/shop/shoe-care' || pathname.startsWith('/category')
                ? 'text-red-600 font-extrabold'
                : 'text-gray-700 group-hover:text-red-600'
            }`}>
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {categoriesDropdown && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 z-50 overflow-hidden">
                <div className="px-4 py-1.5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Select Category
                </div>
                {categories.map((c) => {
                  const href = c.slug === 'shoe-care' ? '/shop/shoe-care' : `/category/${c.slug}`;
                  const isCurrent = pathname === href || (c.slug === 'shoe-care' && pathname === '/shop/shoe-care');
                  return (
                    <Link
                      key={c.slug}
                      href={href}
                      className={`block px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#1F3A5F] text-white font-bold'
                          : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <span>{c.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F4B942] text-[#1F3A5F] font-black uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* About Us Link */}
          <Link
            href="/about"
            className={`py-3.5 border-b-2 transition-colors ${
              pathname === '/about'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            About Us
          </Link>

          {/* Blog Link */}
          <Link
            href="/blog"
            className={`py-3.5 border-b-2 transition-colors ${
              pathname === '/blog'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            Blog
          </Link>

          {/* Contact Link */}
          <Link
            href="/contact"
            className={`py-3.5 border-b-2 transition-colors ${
              pathname === '/contact'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            Contact
          </Link>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-4 max-h-[calc(100vh-70px)] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 bg-gray-50 text-xs rounded-full border border-gray-200 focus:outline-none"
            />
            <button type="submit" aria-label="Submit search" className="absolute right-2 top-2 text-red-600">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-red-600 border-b border-gray-100">
              Home
            </Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-red-600 border-b border-gray-100">
              Shop
            </Link>
            <div className="py-2 font-bold text-gray-400">Categories:</div>
            {categories.map((c) => {
              const href = c.slug === 'shoe-care' ? '/shop/shoe-care' : `/category/${c.slug}`;
              const isCurrent = pathname === href || (c.slug === 'shoe-care' && pathname === '/shop/shoe-care');
              return (
                <Link
                  key={c.slug}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`pl-4 py-1.5 flex items-center justify-between text-xs ${
                    isCurrent ? 'text-red-600 font-black' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <span>• {c.name}</span>
                  {isCurrent && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold uppercase">
                      Current
                    </span>
                  )}
                </Link>
              );
            })}
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-red-600 border-b border-gray-100">
              About Us
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-red-600 border-b border-gray-100">
              Blog
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-red-600">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
