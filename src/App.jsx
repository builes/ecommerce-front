import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext.jsx'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import ProductsList from '@/pages/ProductsList'
import ProductForm from '@/pages/ProductForm'
import OrdersList from '@/pages/OrdersList'
import OrderForm from '@/pages/OrderForm'
import OrderDetail from '@/pages/OrderDetail'
import UsersList from '@/pages/UsersList'
import UserForm from '@/pages/UserForm'
import RolesList from '@/pages/RolesList'
import RoleForm from '@/pages/RoleForm'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsList />} />
              <Route element={<AdminRoute />}>
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
              </Route>
              <Route path="orders" element={<OrdersList />} />
              <Route path="orders/new" element={<OrderForm />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route element={<AdminRoute />}>
                <Route path="users" element={<UsersList />} />
                <Route path="users/new" element={<UserForm />} />
                <Route path="users/:id/edit" element={<UserForm />} />
                <Route path="roles" element={<RolesList />} />
                <Route path="roles/new" element={<RoleForm />} />
                <Route path="roles/:id/edit" element={<RoleForm />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
