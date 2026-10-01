'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('guestCart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('guestCart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('guestCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variation = '', quantity = 1) => {
    const itemPrice = product.salePrice > 0 ? product.salePrice : product.price;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => (i.product._id === product._id || i.product === product._id) && i.variation === variation
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          _id: Date.now().toString(),
          product,
          variation,
          quantity,
          price: itemPrice
        }];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    setCartItems(prev => prev.map(item => item._id === itemId ? { ...item, quantity } : item));
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('guestCart');
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const { data } = await axios.post('/api/coupons/validate', { code, subtotal });
      if (data.success) {
        setCoupon(data.coupon);
        return { success: true, coupon: data.coupon };
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      setCouponError(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = coupon ? coupon.discountAmount : 0;
  const shippingFee = subtotal > 2000 || cartItems.length === 0 ? 0 : 150;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isDrawerOpen,
      setIsDrawerOpen,
      subtotal,
      discountAmount,
      shippingFee,
      grandTotal,
      coupon,
      couponError,
      applyCoupon,
      removeCoupon,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
