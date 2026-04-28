import { Navigate, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'

import { hasPermission, type Permission } from '@/features/auth/permissions/permissions'
import { useAuth } from '@/features/auth/hooks/use-auth'
import type { UserRole } from '@/features/auth/types/auth.types'

function AuthLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Carregando sessao...
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <AuthLoadingFallback />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <AuthLoadingFallback />
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export function PermissionGuard({
  permission,
  roles,
  fallbackPath = '/403',
  children,
}: {
  permission?: Permission
  roles?: UserRole[]
  fallbackPath?: string
  children?: ReactNode
}) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to={fallbackPath} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
