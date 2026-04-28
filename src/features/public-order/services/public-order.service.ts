import { api } from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type {
  CreatePublicOrderPayload,
  PublicOrderResponse,
} from '@/features/public-order/types/public-order.types'

export const publicOrderService = {
  async createPublicOrder(payload: CreatePublicOrderPayload): Promise<PublicOrderResponse> {
    const body: CreatePublicOrderPayload = {
      restaurantSlug: payload.restaurantSlug.trim().toLowerCase(),
      tableCode: payload.tableCode.trim(),
      ...(payload.customerName?.trim() ? { customerName: payload.customerName.trim() } : {}),
      ...(payload.notes?.trim() ? { notes: payload.notes.trim() } : {}),
      items: payload.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        ...(item.notes?.trim() ? { notes: item.notes.trim() } : {}),
      })),
    }

    const { data } = await api.post<ApiSuccessResponse<PublicOrderResponse>>('/public/orders', body)
    return data.data
  },
}
