import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('guestWishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist');
      setWishlist(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const { data } = await API.post('/wishlist', { productId: product._id });
        setWishlist(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setWishlist(prev => {
        const exists = prev.some(item => item._id === product._id);
        if (exists) {
          return prev.filter(item => item._id !== product._id);
        } else {
          return [...prev, product];
        }
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id === productId || item === productId));
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
