export interface ProductCategorySummary {
  id: string
  name: string
}

/** Item de GET /products (lista) */
export interface ProductListItem {
  id: string
  name: string
  price: number
  isAvailable: boolean
  category: ProductCategorySummary
  imageUrl?: string | null
}

/** Detalhe de GET /products/:id */
export interface ProductDetail {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  isAvailable: boolean
  categoryId: string
  createdAt: string
  updatedAt: string
  category: ProductCategorySummary
}

export interface ProductsListResult {
  items: ProductListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type ProductAvailabilityFilter = 'ALL' | 'AVAILABLE' | 'UNAVAILABLE'

export interface ProductListFilters {
  page: number
  limit: number
  search?: string
  categoryId?: string
  isAvailable?: boolean
  availabilityFilter: ProductAvailabilityFilter
}

export interface CreateProductPayload {
  name: string
  description?: string
  price: number
  imageUrl?: string
  imageFile?: File
  categoryId: string
  isAvailable?: boolean
}

export interface UpdateProductPayload {
  name?: string
  description?: string | null
  price?: number
  imageUrl?: string | null
  imageFile?: File
  categoryId?: string
  isAvailable?: boolean
}

export interface ProductCategoryOption {
  id: string
  name: string
}
