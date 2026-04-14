import { Navigate, Outlet } from 'react-router-dom'

import { hasPermission } from '@/features/auth/role-permissions'
import { useAuth } from '@/features/auth/use-auth'
import type { UserRole } from '@/types/domain.types'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export function PermissionGuard({
  permission,
  roles,
  fallbackPath = '/dashboard',
}: {
  permission?: string
  roles?: UserRole[]
  fallbackPath?: string
}) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to={fallbackPath} replace />
  }

  return <Outlet />
}
