export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED'

/** Resposta de GET /tables e GET /tables/:id (backend `TablePublic` — sem publicCode no select). */
export interface Table {
  id: string
  number: string
  capacity: number
  status: TableStatus
  createdAt: string
  updatedAt: string
}

export interface TablesListResult {
  items: Table[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type TableStatusFilter = 'ALL' | TableStatus

export interface TableListFilters {
  page: number
  limit: number
  search?: string
  status: TableStatusFilter
}

export interface CreateTablePayload {
  number: string
  capacity: number
  status?: TableStatus
}

export interface UpdateTablePayload {
  number?: string
  capacity?: number
  status?: TableStatus
}
