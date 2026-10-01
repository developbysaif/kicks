'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1D33] text-gray-300 font-sans pt-14 pb-6 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col inline-block">
              <span className="text-3xl font-black italic tracking-tighter text-red-600">
                KICK<sup className="text-xs font-bold text-red-500 not-italic ml-0.5">®</sup>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase -mt-1">
                Home Care
              </span>
            </Link>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Kara Asani Zindagi Main
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-red-500 transition-colors">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/account" className="text-gray-400 hover:text-red-500 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-400 hover:text-red-500 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-400 hover:text-red-500 transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Categories */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/shoe-care" className="text-gray-400 hover:text-red-500 transition-colors">
                  Shoe Care
                </Link>
              </li>
              <li>
                <Link href="/category/laundry-care" className="text-gray-400 hover:text-red-500 transition-colors">
                  Laundry Care
                </Link>
              </li>
              <li>
                <Link href="/category/home-cleaning" className="text-gray-400 hover:text-red-500 transition-colors">
                  Home Cleaning
                </Link>
              </li>
              <li>
                <Link href="/category/dish-care" className="text-gray-400 hover:text-red-500 transition-colors">
                  Bath Care
                </Link>
              </li>
              <li>
                <Link href="/category/drain-care" className="text-gray-400 hover:text-red-500 transition-colors">
                  Drain Care
                </Link>
              </li>
              <li>
                <Link href="/category/mosquito-protection" className="text-gray-400 hover:text-red-500 transition-colors">
                  Mosquito Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>info@kickhomecare.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>123 Main Street, Lahore Pakistan</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-3 md:space-y-0">
          <p>© 2025 KICK Home Care. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
