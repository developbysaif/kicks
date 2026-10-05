'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('userInfo');
      }
    } else if (process.env.NODE_ENV !== 'production') {
      const devAdmin = {
        _id: 'admin_dev',
        name: 'Kick Admin',
        email: 'admin@kickhomecare.com',
        role: 'admin',
        token: 'dev_admin_token',
        emailVerified: true
      };
      setUser(devAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.success) {
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        setError(data.message || 'Login failed');
        return {
          success: false,
          requireVerification: data.requireVerification,
          email: data.email,
          message: data.message
        };
      }
    } catch (err) {
      if (err.response?.data?.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: err.response.data.email,
          message: err.response.data.message
        };
      }
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/register', { name, email, password, phone });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/verify-email', { token });
      return data;
    } catch (err) {
      return {
        success: false,
        expired: err.response?.data?.expired || false,
        alreadyVerified: err.response?.data?.alreadyVerified || false,
        message: err.response?.data?.message || err.message || 'Verification failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    try {
      const { data } = await axios.post('/api/auth/resend-verification', { email });
      return data;
    } catch (err) {
      return {
        success: false,
        rateLimited: err.response?.status === 429,
        message: err.response?.data?.message || err.message || 'Failed to resend verification email.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      verifyEmail,
      resendVerification,
      logout,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
