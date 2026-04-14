export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'

export interface OrderTableRef {
  id: string
  number: string
}

/** GET /orders — item da lista (backend `OrderListItem`). */
export interface OrderListItem {
  id: string
  status: OrderStatus
  customerName: string | null
  total: number
  table: OrderTableRef
  createdAt: string
}

/** GET /orders/:id — item de linha (backend mapeia `product.name` para `name`). */
export interface OrderDetailItem {
  id: string
  productId: string
  name: string
  imageUrl: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string | null
}

/** GET /orders/:id — `OrderDetail` do backend. */
export interface OrderDetail {
  id: string
  status: OrderStatus
  customerName: string | null
  notes: string | null
  total: number
  table: OrderTableRef
  items: OrderDetailItem[]
  createdAt: string
  updatedAt: string
}

export interface OrdersListResult {
  items: OrderListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface OrderFilters {
  page?: number
  limit?: number
  status?: OrderStatus
  tableId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus
}

/** Resposta de PATCH /kitchen/orders/:id/deliver (backend `OrderStatusChangedResult`). */
export interface OrderDeliverResult {
  id: string
  status: OrderStatus
  updatedAt: string
  table: OrderTableRef
}
