import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDetail,
  UserListFilters,
  UserStatusFilter,
  UsersListResult,
} from '@/features/users/types/users.types'

function resolveIsActiveByFilter(statusFilter: UserStatusFilter): boolean | undefined {
  if (statusFilter === 'ALL') return undefined
  return statusFilter === 'ACTIVE'
}

export const usersService = {
  async list(filters: UserListFilters): Promise<UsersListResult> {
    const { page, limit, search, role, statusFilter } = filters
    const isActive = resolveIsActiveByFilter(statusFilter)

    const { data } = await api.get<ApiPaginatedResponse<UserDetail>>('/users', {
      params: {
        page,
        limit,
        ...(search?.trim() ? { search: search.trim() } : {}),
        ...(role ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    })

    return {
      items: data.data,
      meta: data.meta,
    }
  },

  async getById(id: string): Promise<UserDetail> {
    const { data } = await api.get<ApiSuccessResponse<UserDetail>>(`/users/${id}`)
    return data.data
  },

  async create(payload: CreateUserPayload): Promise<UserDetail> {
    const body: CreateUserPayload = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: payload.role,
    }

    const { data } = await api.post<ApiSuccessResponse<UserDetail>>('/users', body)
    return data.data
  },

  async update(id: string, payload: UpdateUserPayload): Promise<UserDetail> {
    const body: UpdateUserPayload = {
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.email !== undefined ? { email: payload.email.trim().toLowerCase() } : {}),
      ...(payload.role !== undefined ? { role: payload.role } : {}),
      ...(payload.isActive !== undefined ? { isActive: payload.isActive } : {}),
    }

    const { data } = await api.patch<ApiSuccessResponse<UserDetail>>(`/users/${id}`, body)
    return data.data
  },
}
