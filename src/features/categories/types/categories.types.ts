export interface Category {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoriesListResult {
  items: Category[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type CategoryActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface CategoryListFilters {
  page: number
  limit: number
  search?: string
  isActive?: boolean
  activeFilter: CategoryActiveFilter
}

export interface CreateCategoryPayload {
  name: string
  description?: string
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string | null
  isActive?: boolean
}
