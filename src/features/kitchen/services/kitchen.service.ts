import { api } from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type {
  KitchenOrder,
  KitchenOrderActionResult,
  KitchenOrderSummary,
} from '@/features/kitchen/types/kitchen.types'

export const kitchenService = {
  async listActiveOrders(): Promise<KitchenOrder[]> {
    const { data } = await api.get<ApiSuccessResponse<KitchenOrderSummary[]>>('/kitchen/orders')

    const details = await Promise.all(
      data.data.map((order) =>
        api
          .get<ApiSuccessResponse<KitchenOrder>>(`/orders/${order.id}`)
          .then((detail) => detail.data.data),
      ),
    )

    return details
      .filter((order) => order.status === 'PENDING' || order.status === 'PREPARING')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  },

  async startOrder(orderId: string): Promise<KitchenOrderActionResult> {
    const { data } = await api.patch<ApiSuccessResponse<KitchenOrderActionResult>>(
      `/kitchen/orders/${orderId}/start`,
    )
    return data.data
  },

  async readyOrder(orderId: string): Promise<KitchenOrderActionResult> {
    const { data } = await api.patch<ApiSuccessResponse<KitchenOrderActionResult>>(
      `/kitchen/orders/${orderId}/ready`,
    )
    return data.data
  },
}
