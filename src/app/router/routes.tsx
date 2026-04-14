import { createBrowserRouter, Navigate } from 'react-router-dom'

import { BillsPage } from '@/features/bills/bills-page'
import { CategoriesPage } from '@/features/categories/categories-page'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { GuestRoute, PermissionGuard, ProtectedRoute } from '@/features/auth/guards'
import { LoginPage } from '@/features/auth/login-page'
import { KitchenPage } from '@/features/kitchen/kitchen-page'
import { OrdersPage } from '@/features/orders/orders-page'
import { PublicMenuPage } from '@/features/public-menu/public-menu-page'
import { PublicCartPage } from '@/features/public-order/public-cart-page'
import { ProductsPage } from '@/features/products/products-page'
import { TablesPage } from '@/features/tables/tables-page'
import { UsersPage } from '@/features/users/users-page'
import { WaiterCallsPage } from '@/features/waiter-call/waiter-calls-page'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { PublicLayout } from '@/layouts/public-layout'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/menu/:restaurantSlug/table/:tableCode', element: <PublicMenuPage /> },
      { path: '/menu/:restaurantSlug/table/:tableCode/cart', element: <PublicCartPage /> },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: '/login', element: <LoginPage /> }],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          {
            path: '/kitchen',
            element: (
              <PermissionGuard roles={['ADMIN', 'MANAGER', 'KITCHEN']}>
                <KitchenPage />
              </PermissionGuard>
            ),
          },
          {
            path: '/orders',
            element: (
              <PermissionGuard roles={['ADMIN', 'MANAGER', 'WAITER']}>
                <OrdersPage />
              </PermissionGuard>
            ),
          },
          {
            path: '/waiter-calls',
            element: (
              <PermissionGuard roles={['ADMIN', 'MANAGER', 'WAITER']}>
                <WaiterCallsPage />
              </PermissionGuard>
            ),
          },
          {
            path: '/bills',
            element: (
              <PermissionGuard roles={['ADMIN', 'MANAGER', 'WAITER']}>
                <BillsPage />
              </PermissionGuard>
            ),
          },
          {
            path: '/tables',
            element: (
              <PermissionGuard roles={['ADMIN', 'MANAGER']}>
                <TablesPage />
              </PermissionGuard>
            ),
          },
          { path: '/products', element: <ProductsPage /> },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/users', element: <UsersPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
