import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  CategoriesListResult,
  Category,
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/features/categories/types/categories.types'

async function listCategoriesPage(
  page: number,
  limit: number,
  search?: string,
  isActive?: boolean,
): Promise<CategoriesListResult> {
  const { data } = await api.get<ApiPaginatedResponse<Category>>('/categories', {
    params: {
      page,
      limit,
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  })

  return {
    items: data.data,
    meta: data.meta,
  }
}

export const categoriesService = {
  async list(filters: CategoryListFilters): Promise<CategoriesListResult> {
    const { page, limit, search, activeFilter } = filters
    const isActive =
      activeFilter === 'ALL' ? undefined : activeFilter === 'ACTIVE' ? true : false

    return listCategoriesPage(page, limit, search, isActive)
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<ApiSuccessResponse<Category>>(`/categories/${id}`)
    return data.data
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await api.post<ApiSuccessResponse<Category>>('/categories', {
      name: payload.name.trim(),
      ...(payload.description?.trim()
        ? { description: payload.description.trim() }
        : {}),
    })
    return data.data
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const body: UpdateCategoryPayload = {
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.isActive !== undefined ? { isActive: payload.isActive } : {}),
    }

    const { data } = await api.patch<ApiSuccessResponse<Category>>(
      `/categories/${id}`,
      body,
    )
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiSuccessResponse<null>>(`/categories/${id}`)
  },
}
