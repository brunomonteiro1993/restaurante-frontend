import type { UserRole } from '@/features/auth/types/auth.types'

export const ALL_PERMISSIONS = [
  'dashboard.read',
  'kitchen.read',
  'kitchen.start',
  'kitchen.ready',
  'orders.read',
  'orders.updateStatus',
  'orders.deliver',
  'waiterCalls.read',
  'waiterCalls.updateStatus',
  'bills.read',
  'bills.close',
  'bills.pay',
  'tables.manage',
  'categories.manage',
  'products.manage',
  'users.manage',
] as const

export type Permission = (typeof ALL_PERMISSIONS)[number]

export const ROLE_PERMISSIONS: Record<UserRole, readonly (Permission | '*')[]> = {
  ADMIN: ['*'],
  MANAGER: [
    'dashboard.read',
    'kitchen.read',
    'kitchen.start',
    'kitchen.ready',
    'orders.read',
    'orders.updateStatus',
    'orders.deliver',
    'waiterCalls.read',
    'waiterCalls.updateStatus',
    'bills.read',
    'bills.close',
    'bills.pay',
    'tables.manage',
    'categories.manage',
    'products.manage',
    'users.manage',
  ],
  WAITER: [
    'dashboard.read',
    'orders.read',
    'orders.deliver',
    'waiterCalls.read',
    'waiterCalls.updateStatus',
    'bills.read',
    'bills.close',
    'bills.pay',
  ],
  KITCHEN: ['dashboard.read', 'kitchen.read', 'kitchen.start', 'kitchen.ready'],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions.includes('*') || permissions.includes(permission)
}

export function hasAnyPermission(role: UserRole, permissions: readonly Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}
