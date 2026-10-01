import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Sync cart when user logs in
  useEffect(() => {
    if (user) {
      fetchUserCart();
    }
  }, [user]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const fetchUserCart = async () => {
    try {
      const { data } = await API.get('/cart');
      if (data && data.items) {
        const formatted = data.items.map(item => ({
          _id: item._id,
          product: item.product,
          variation: item.variation || '',
          quantity: item.quantity,
          price: item.price
        }));
        setCartItems(formatted);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (product, variation = '', quantity = 1) => {
    const itemPrice = product.salePrice > 0 ? product.salePrice : product.price;

    if (user) {
      try {
        const { data } = await API.post('/cart', {
          productId: product._id,
          variation,
          quantity,
          price: itemPrice
        });
        if (data && data.items) {
          setCartItems(data.items.map(i => ({
            _id: i._id,
            product: i.product,
            variation: i.variation,
            quantity: i.quantity,
            price: i.price
          })));
        }
      } catch (err) {
        console.error('DB cart error:', err);
      }
    } else {
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
    }

    setIsDrawerOpen(true);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    if (user) {
      try {
        const { data } = await API.put(`/cart/${itemId}`, { quantity });
        if (data && data.items) {
          setCartItems(data.items.map(i => ({
            _id: i._id,
            product: i.product,
            variation: i.variation,
            quantity: i.quantity,
            price: i.price
          })));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setCartItems(prev => prev.map(item => item._id === itemId ? { ...item, quantity } : item));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const { data } = await API.delete(`/cart/${itemId}`);
        if (data && data.items) {
          setCartItems(data.items.map(i => ({
            _id: i._id,
            product: i.product,
            variation: i.variation,
            quantity: i.quantity,
            price: i.price
          })));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setCartItems(prev => prev.filter(item => item._id !== itemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await API.delete('/cart');
      } catch (err) {
        console.error(err);
      }
    }
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('guestCart');
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const { data } = await API.post('/coupons/apply', { code, cartTotal: subtotal });
      setCoupon(data);
      return { success: true, coupon: data };
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
