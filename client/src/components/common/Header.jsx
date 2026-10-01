import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import API, { FALLBACK_CATEGORIES } from '../../services/api';

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

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdown(false);
  }, [location]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
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
          const { data } = await API.get(`/products/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
          if (Array.isArray(data)) {
            setSuggestions(data);
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

    const timer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 border-b border-gray-100 shadow-xs">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-1.5 px-4 text-xs font-medium text-gray-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-gray-700">Free Shipping on Orders Above Rs. 3,000</span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs text-gray-600">
            <Link to="/track-order" className="hover:text-red-600 transition-colors">
              Track Order
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="hover:text-red-600 transition-colors">
              Help
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="hover:text-red-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-700 hover:text-red-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex flex-col group">
          <div className="flex items-center">
            <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-red-600 group-hover:text-red-700 transition-colors">
              KICK<sup className="text-xs font-bold text-red-500 not-italic ml-0.5">®</sup>
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-800 tracking-wider uppercase -mt-1">
            Home Care
          </span>
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
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              {suggestions.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
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

        {/* User Actions */}
        <div className="flex items-center space-x-5 text-gray-700">
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={isAdmin ? '/admin' : '/account'}
                className="flex items-center space-x-1.5 hover:text-red-600 transition-colors text-xs font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1.5 hover:text-red-600 transition-colors text-xs font-bold"
            >
              <UserIcon className="w-5 h-5 text-gray-700" />
              <span className="hidden sm:inline">Login / Register</span>
            </Link>
          )}

          <Link
            to="/wishlist"
            className="relative p-1.5 hover:text-red-600 transition-colors"
          >
            <Heart className="w-6 h-6 text-gray-700 hover:text-red-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
              {wishlistCount}
            </span>
          </Link>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-1.5 hover:text-red-600 transition-colors flex items-center"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-red-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="border-t border-gray-100 hidden lg:block bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/"
            className={`py-3.5 border-b-2 transition-colors ${
              location.pathname === '/'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            Home
          </Link>

          <Link
            to="/shop"
            className={`py-3.5 border-b-2 transition-colors ${
              location.pathname === '/shop'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent text-gray-700 hover:text-red-600'
            }`}
          >
            Shop
          </Link>

          <div
            className="relative py-3.5 cursor-pointer group"
            onMouseEnter={() => setCategoriesDropdown(true)}
            onMouseLeave={() => setCategoriesDropdown(false)}
          >
            <div className="flex items-center space-x-1 text-gray-700 group-hover:text-red-600 transition-colors">
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {categoriesDropdown && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/category/${c.slug}`}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/about"
            className="py-3.5 border-b-2 border-transparent text-gray-700 hover:text-red-600 transition-colors"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="py-3.5 border-b-2 border-transparent text-gray-700 hover:text-red-600 transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
