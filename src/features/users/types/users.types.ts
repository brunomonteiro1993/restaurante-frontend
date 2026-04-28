import type { UserRole } from '@/features/auth/types/auth.types'

export interface UserListItem {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  restaurantId: string
  createdAt: string
  updatedAt: string
}

export type UserDetail = UserListItem

export interface UsersListResult {
  items: UserListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type UserStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface UserListFilters {
  page: number
  limit: number
  search?: string
  role?: UserRole
  isActive?: boolean
  statusFilter: UserStatusFilter
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: UserRole
  isActive?: boolean
}

export interface ToggleUserStatusPayload {
  isActive: boolean
}
