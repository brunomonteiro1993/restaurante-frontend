import type { UserRole } from '@/features/auth/types/auth.types'

export const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ['*'],
  MANAGER: [
    'dashboard:view',
    'kitchen:view',
    'orders:view',
    'orders:updateStatus',
    'orders:deliver',
    'waiter-calls:view',
    'bills:view',
    'tables:manage',
    'products:view',
    'categories:view',
    'users:view',
  ],
  WAITER: ['dashboard:view', 'orders:view', 'orders:deliver', 'waiter-calls:view', 'bills:view'],
  KITCHEN: ['dashboard:view', 'kitchen:view'],
}

export const hasPermission = (role: UserRole, permission: string) => {
  const permissions = rolePermissions[role]
  return permissions.includes('*') || permissions.includes(permission)
}
