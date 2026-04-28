import { api } from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type { PublicOrderTrackingResult } from '@/features/public-order-tracking/types/public-order-tracking.types'

export const publicOrderTrackingService = {
  async getPublicOrderTracking(
    restaurantSlug: string,
    tableCode: string,
    _orderId: string,
  ): Promise<PublicOrderTrackingResult> {
    const { data } = await api.get<ApiSuccessResponse<PublicOrderTrackingResult>>(
      '/public/orders/status',
      {
        params: {
          restaurantSlug: restaurantSlug.trim().toLowerCase(),
          tableCode: tableCode.trim(),
        },
      },
    )

    return data.data
  },
}
