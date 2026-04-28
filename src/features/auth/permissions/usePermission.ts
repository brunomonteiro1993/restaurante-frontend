import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  hasAnyPermission,
  hasPermission,
  type Permission,
} from '@/features/auth/permissions/permissions'

export function usePermission() {
  const { user } = useAuth()

  const can = (permission: Permission): boolean => {
    if (!user) return false
    return hasPermission(user.role, permission)
  }

  const canAny = (permissions: readonly Permission[]): boolean => {
    if (!user) return false
    return hasAnyPermission(user.role, permissions)
  }

  return {
    user,
    role: user?.role,
    can,
    canAny,
  }
}
