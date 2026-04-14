import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  CreateTablePayload,
  Table,
  TableListFilters,
  TablesListResult,
  UpdateTablePayload,
} from '@/features/tables/types/tables.types'

const PAGE_SIZE = 100

async function fetchAllTablesWithSearch(search?: string): Promise<Table[]> {
  const first = await api.get<ApiPaginatedResponse<Table>>('/tables', {
    params: { page: 1, limit: PAGE_SIZE, ...(search?.trim() ? { search: search.trim() } : {}) },
  })

  const items = [...first.data.data]
  const totalPages = first.data.meta.totalPages

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        api.get<ApiPaginatedResponse<Table>>('/tables', {
          params: { page: i + 2, limit: PAGE_SIZE, ...(search?.trim() ? { search: search.trim() } : {}) },
        }),
      ),
    )
    rest.forEach((r) => items.push(...r.data.data))
  }

  return items
}

function paginateLocal(items: Table[], page: number, limit: number): TablesListResult {
  const total = items.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit)
  const start = (page - 1) * limit
  return {
    items: items.slice(start, start + limit),
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  }
}

async function listTablesPage(page: number, limit: number, search?: string): Promise<TablesListResult> {
  const { data } = await api.get<ApiPaginatedResponse<Table>>('/tables', {
    params: {
      page,
      limit,
      ...(search?.trim() ? { search: search.trim() } : {}),
    },
  })
  return {
    items: data.data,
    meta: data.meta,
  }
}

export const tablesService = {
  async list(filters: TableListFilters): Promise<TablesListResult> {
    const { page, limit, search, status } = filters
    if (status === 'ALL') {
      return listTablesPage(page, limit, search)
    }
    const all = await fetchAllTablesWithSearch(search)
    const filtered = all.filter((t) => t.status === status)
    return paginateLocal(filtered, page, limit)
  },

  listPage: listTablesPage,

  /**
   * Busca todas as mesas com o mesmo `search` (varias paginas) para filtro de status no cliente.
   */
  fetchAllWithSearch: fetchAllTablesWithSearch,

  paginateLocal,

  async getById(id: string): Promise<Table> {
    const { data } = await api.get<ApiSuccessResponse<Table>>(`/tables/${id}`)
    return data.data
  },

  async create(payload: CreateTablePayload): Promise<Table> {
    const body: CreateTablePayload = {
      number: payload.number.trim(),
      capacity: payload.capacity,
      ...(payload.status ? { status: payload.status } : {}),
    }
    const { data } = await api.post<ApiSuccessResponse<Table>>('/tables', body)
    return data.data
  },

  async update(id: string, payload: UpdateTablePayload): Promise<Table> {
    const { data } = await api.patch<ApiSuccessResponse<Table>>(`/tables/${id}`, payload)
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiSuccessResponse<null>>(`/tables/${id}`)
  },
}
