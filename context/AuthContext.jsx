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
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('userInfo');
      }
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

  const register = async (name, email, password, confirmPassword, phone) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        confirmPassword,
        phone
      });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp, purpose = 'EMAIL_VERIFICATION') => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/verify-otp', { email, otp, purpose });

      if (data.success && data.token && data.user) {
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
      }

      return data;
    } catch (err) {
      return {
        success: false,
        expired: err.response?.data?.expired || false,
        maxAttemptsReached: err.response?.data?.maxAttemptsReached || false,
        message: err.response?.data?.message || err.message || 'Verification failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email, purpose = 'EMAIL_VERIFICATION') => {
    try {
      const { data } = await axios.post('/api/auth/resend-otp', { email, purpose });
      return data;
    } catch (err) {
      return {
        success: false,
        cooldown: err.response?.data?.cooldown || false,
        rateLimited: err.response?.status === 429,
        retryAfter: err.response?.data?.retryAfter || 0,
        message: err.response?.data?.message || err.message || 'Failed to resend code.'
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email });
      return data;
    } catch (err) {
      return {
        success: false,
        rateLimited: err.response?.status === 429,
        message: err.response?.data?.message || err.message || 'Failed to send reset code.'
      };
    }
  };

  const resetPassword = async ({ email, otp, resetToken, newPassword, confirmPassword }) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/reset-password', {
        email,
        otp,
        resetToken,
        newPassword,
        confirmPassword
      });
      return data;
    } catch (err) {
      return {
        success: false,
        expired: err.response?.data?.expired || false,
        message: err.response?.data?.message || err.message || 'Failed to reset password.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Backwards compatibility wrappers
  const verifyEmail = async (token, email) => {
    return await verifyOtp(email, token, 'EMAIL_VERIFICATION');
  };

  const resendVerification = async (email) => {
    return await resendOtp(email, 'EMAIL_VERIFICATION');
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
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
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
export default AuthContext;
