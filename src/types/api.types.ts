export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiPaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiPaginatedResponse<T> {
  success: true
  data: T[]
  meta: ApiPaginatedMeta
}
