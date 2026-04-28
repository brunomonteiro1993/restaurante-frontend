import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  CreateProductPayload,
  ProductCategoryOption,
  ProductDetail,
  ProductListFilters,
  ProductListItem,
  ProductsListResult,
  UpdateProductPayload,
} from '@/features/products/types/products.types'

interface CategoryApiItem {
  id: string
  name: string
  isActive: boolean
}

const CATEGORY_PAGE_SIZE = 100

async function listAllCategoriesForSelect(): Promise<ProductCategoryOption[]> {
  const first = await api.get<ApiPaginatedResponse<CategoryApiItem>>('/categories', {
    params: {
      page: 1,
      limit: CATEGORY_PAGE_SIZE,
      isActive: true,
    },
  })

  const items = [...first.data.data]
  const totalPages = first.data.meta.totalPages

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        api.get<ApiPaginatedResponse<CategoryApiItem>>('/categories', {
          params: {
            page: i + 2,
            limit: CATEGORY_PAGE_SIZE,
            isActive: true,
          },
        }),
      ),
    )
    rest.forEach((response) => items.push(...response.data.data))
  }

  return items
    .filter((c) => c.isActive)
    .map((c) => ({ id: c.id, name: c.name }))
}

export const productsService = {
  async list(filters: ProductListFilters): Promise<ProductsListResult> {
    const { page, limit, search, categoryId, availabilityFilter } = filters
    const isAvailable =
      availabilityFilter === 'ALL'
        ? undefined
        : availabilityFilter === 'AVAILABLE'
          ? true
          : false

    const { data } = await api.get<ApiPaginatedResponse<ProductListItem>>('/products', {
      params: {
        page,
        limit,
        ...(search?.trim() ? { search: search.trim() } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(isAvailable !== undefined ? { isAvailable } : {}),
      },
    })

    return {
      items: data.data,
      meta: data.meta,
    }
  },

  async getById(id: string): Promise<ProductDetail> {
    const { data } = await api.get<ApiSuccessResponse<ProductDetail>>(`/products/${id}`)
    return data.data
  },

  async create(payload: CreateProductPayload): Promise<ProductDetail> {
    const hasImageFile = payload.imageFile instanceof File

    if (hasImageFile) {
      const form = new FormData()
      form.append('name', payload.name.trim())
      form.append('price', String(payload.price))
      form.append('categoryId', payload.categoryId)
      form.append('isAvailable', String(payload.isAvailable ?? true))
      form.append('image', payload.imageFile as File)
      if (payload.description?.trim()) form.append('description', payload.description.trim())
      if (payload.imageUrl?.trim()) form.append('imageUrl', payload.imageUrl.trim())

      const { data } = await api.post<ApiSuccessResponse<ProductDetail>>('/products', form)
      return data.data
    }

    const body: CreateProductPayload = {
      name: payload.name.trim(),
      price: payload.price,
      categoryId: payload.categoryId,
      isAvailable: payload.isAvailable,
      ...(payload.description?.trim() ? { description: payload.description.trim() } : {}),
      ...(payload.imageUrl?.trim() ? { imageUrl: payload.imageUrl.trim() } : {}),
    }

    const { data } = await api.post<ApiSuccessResponse<ProductDetail>>('/products', body)
    return data.data
  },

  async update(id: string, payload: UpdateProductPayload): Promise<ProductDetail> {
    const hasImageFile = payload.imageFile instanceof File

    if (hasImageFile) {
      const form = new FormData()
      if (payload.name !== undefined) form.append('name', payload.name.trim())
      if (payload.description !== undefined) form.append('description', payload.description ?? '')
      if (payload.price !== undefined) form.append('price', String(payload.price))
      if (payload.imageUrl !== undefined) form.append('imageUrl', payload.imageUrl ?? '')
      if (payload.categoryId !== undefined) form.append('categoryId', payload.categoryId)
      if (payload.isAvailable !== undefined) form.append('isAvailable', String(payload.isAvailable))
      form.append('image', payload.imageFile as File)

      const { data } = await api.patch<ApiSuccessResponse<ProductDetail>>(`/products/${id}`, form)
      return data.data
    }

    const body: UpdateProductPayload = {
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.price !== undefined ? { price: payload.price } : {}),
      ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
      ...(payload.categoryId !== undefined ? { categoryId: payload.categoryId } : {}),
      ...(payload.isAvailable !== undefined ? { isAvailable: payload.isAvailable } : {}),
    }

    const { data } = await api.patch<ApiSuccessResponse<ProductDetail>>(
      `/products/${id}`,
      body,
    )
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiSuccessResponse<null>>(`/products/${id}`)
  },

  listCategoryOptions: listAllCategoriesForSelect,
}
