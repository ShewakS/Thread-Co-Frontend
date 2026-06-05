import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import ProductsPage from '../Pages/ProductsPage';
import CartPage from '../Pages/CartPage';
import AboutPage from '../Pages/AboutPage';
import ContactPage from '../Pages/ContactPage';
import FaqPage from '../Pages/FaqPage';
import ForgotPasswordPage from '../Pages/ForgotPasswordPage';
import LoginPage from '../Pages/LoginPage';
import SignupPage from '../Pages/SignupPage';
import PrivacyPage from '../Pages/PrivacyPage';
import TermsPage from '../Pages/TermsPage';
import NotFoundPage from '../Pages/NotFoundPage';
import ProductDetails from '../Pages/ProductDetails';
import Wishlist from '../Pages/Wishlist';
import Checkout from '../Pages/Checkout';
import OrderSuccess from '../Pages/OrderSuccess';
import MyOrders from '../Pages/MyOrders';
import Profile from '../Pages/Profile';
import SizeGuide from '../Pages/SizeGuide';
import Offers from '../Pages/Offers';
import AdminLayout from '../Components/AdminLayout';
import AdminDashboard from '../Pages/AdminDashboard';
import AdminProducts from '../Pages/AdminProducts';
import AdminOrders from '../Pages/AdminOrders';
import AdminUsers from '../Pages/AdminUsers';
import AdminOffers from '../Pages/AdminOffers';
import { useStore } from '../Components/StoreContext';

// Redirects to login, saves the page they were trying to visit
const AuthRequired = ({ children }) => {
  const { currentUser } = useStore();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser } = useStore();
  return currentUser && currentUser.role === 'admin' ? children : <Navigate replace to="/" />;
};

const GuestRoute = ({ children }) => {
  const { currentUser } = useStore();
  if (currentUser) {
    return <Navigate replace to={currentUser.role === 'admin' ? '/admin/dashboard' : '/'} />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Auth routes */}
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

    {/* Fully public — no login needed */}
    <Route path="/" element={<HomePage />} />
    <Route path="/index.html" element={<Navigate replace to="/" />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/faq" element={<FaqPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/size-guide" element={<SizeGuide />} />
    <Route path="/offers" element={<Offers />} />

    {/* Login required */}
    <Route path="/cart" element={<AuthRequired><CartPage /></AuthRequired>} />
    <Route path="/wishlist" element={<AuthRequired><Wishlist /></AuthRequired>} />
    <Route path="/checkout" element={<AuthRequired><Checkout /></AuthRequired>} />
    <Route path="/order-success" element={<AuthRequired><OrderSuccess /></AuthRequired>} />
    <Route path="/my-orders" element={<AuthRequired><MyOrders /></AuthRequired>} />
    <Route path="/profile" element={<AuthRequired><Profile /></AuthRequired>} />

    {/* Admin */}
    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<Navigate replace to="dashboard" />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="offers" element={<AdminOffers />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
