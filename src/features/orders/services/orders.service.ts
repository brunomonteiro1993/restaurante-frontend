import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  OrderDeliverResult,
  OrderDetail,
  OrderFilters,
  OrderListItem,
  OrdersListResult,
  UpdateOrderStatusPayload,
} from '@/features/orders/types/orders.types'

const DEFAULT_LIMIT = 20

export const ordersService = {
  async list(filters: OrderFilters): Promise<OrdersListResult> {
    const { page = 1, limit = DEFAULT_LIMIT, status, tableId, tableNumber, search, dateFrom, dateTo } =
      filters

    const { data } = await api.get<ApiPaginatedResponse<OrderListItem>>('/orders', {
      params: {
        page,
        limit,
        ...(status ? { status } : {}),
        ...(tableNumber?.trim() ? { tableNumber: tableNumber.trim() } : {}),
        ...(tableId && !tableNumber?.trim() ? { tableId } : {}),
        ...(search?.trim() ? { search: search.trim() } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      },
    })

    return {
      items: data.data,
      meta: data.meta,
    }
  },

  async getById(id: string): Promise<OrderDetail> {
    const { data } = await api.get<ApiSuccessResponse<OrderDetail>>(`/orders/${id}`)
    return data.data
  },

  /** Requer permissao `orders.updateStatus` no backend (ADMIN / MANAGER). */
  async updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<OrderDetail> {
    const { data } = await api.patch<ApiSuccessResponse<OrderDetail>>(`/orders/${id}/status`, payload)
    return data.data
  },

  /** Requer permissao `orders.deliver` no backend (WAITER / MANAGER / ADMIN). READY -> DELIVERED. */
  async deliverOrder(id: string): Promise<OrderDeliverResult> {
    const { data } = await api.patch<ApiSuccessResponse<OrderDeliverResult>>(
      `/kitchen/orders/${id}/deliver`,
    )
    return data.data
  },
}
