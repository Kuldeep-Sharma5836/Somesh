import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CartPage from './pages/customer/CartPage';
import LoginPage from './pages/customer/LoginPage';
import SignupPage from './pages/customer/SignupPage';
import ProfilePage from './pages/customer/ProfilePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

const App = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/:id" element={<ProductDetailsPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="products" element={<AdminProductsPage />} />
      <Route path="products/new" element={<AdminProductFormPage />} />
      <Route path="products/:id/edit" element={<AdminProductFormPage />} />
      <Route path="categories" element={<AdminCategoriesPage />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="orders" element={<AdminOrdersPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
