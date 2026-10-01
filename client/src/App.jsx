import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Common UI
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import CompareModal from './components/common/CompareModal';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';

// Customer Account Pages
import Dashboard from './pages/account/Dashboard';
import MyOrders from './pages/account/MyOrders';
import OrderDetailsPage from './pages/account/OrderDetailsPage';
import Addresses from './pages/account/Addresses';
import Profile from './pages/account/Profile';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminInventory from './pages/admin/AdminInventory';
import AdminMessages from './pages/admin/AdminMessages';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <Router>
                <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
                  <Routes>
                    
                    {/* Admin Routes with Separate Admin Layout */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/new" element={<AdminProductEdit />} />
                      <Route path="products/edit/:id" element={<AdminProductEdit />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="coupons" element={<AdminCoupons />} />
                      <Route path="messages" element={<AdminMessages />} />
                    </Route>

                    {/* Customer Storefront Routes with Main Header & Footer */}
                    <Route path="*" element={
                      <>
                        <Header />
                        <CartDrawer />
                        <CompareModal />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/category/:slug" element={<CategoryPage />} />
                            <Route path="/product/:slug" element={<ProductDetails />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/refund-policy" element={<RefundPolicy />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy />} />

                            {/* Customer Account Routes */}
                            <Route path="/account" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/account/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                            <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
                            <Route path="/account/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
                            <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                          </Routes>
                        </main>
                        <Footer />
                      </>
                    } />

                  </Routes>
                </div>
              </Router>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
