import { api } from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type {
  CreatePublicWaiterCallPayload,
  PublicWaiterCallCreatedResult,
  PublicWaiterCallStatusResult,
} from '@/features/public-waiter-call/types/public-waiter-call.types'

export const publicWaiterCallService = {
  async getPublicWaiterCallStatus(
    restaurantSlug: string,
    tableCode: string,
  ): Promise<PublicWaiterCallStatusResult> {
    const { data } = await api.get<ApiSuccessResponse<PublicWaiterCallStatusResult>>(
      '/public/waiter-calls/status',
      {
        params: {
          restaurantSlug: restaurantSlug.trim().toLowerCase(),
          tableCode: tableCode.trim(),
        },
      },
    )
    return data.data
  },

  async createPublicWaiterCall(
    payload: CreatePublicWaiterCallPayload,
  ): Promise<PublicWaiterCallCreatedResult> {
    const { data } = await api.post<ApiSuccessResponse<PublicWaiterCallCreatedResult>>(
      '/public/waiter-calls',
      {
        restaurantSlug: payload.restaurantSlug.trim().toLowerCase(),
        tableCode: payload.tableCode.trim(),
      },
    )
    return data.data
  },
}
