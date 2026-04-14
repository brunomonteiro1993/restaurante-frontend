import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  WaiterCallDetail,
  WaiterCallFilters,
  WaiterCallListItem,
  WaiterCallsListResult,
  WaiterCallStatus,
  WaiterCallStatusUpdated,
} from '@/features/waiter-calls/types/waiter-calls.types'

const DEFAULT_LIMIT = 50

export const waiterCallsService = {
  async list(filters: WaiterCallFilters): Promise<WaiterCallsListResult> {
    const {
      page = 1,
      limit = DEFAULT_LIMIT,
      status,
      tableId,
      dateFrom,
      dateTo,
      onlyOpen,
    } = filters

    const { data } = await api.get<ApiPaginatedResponse<WaiterCallListItem>>('/waiter-calls', {
      params: {
        page,
        limit,
        ...(status ? { status } : {}),
        ...(tableId ? { tableId } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
        ...(onlyOpen !== undefined ? { onlyOpen } : {}),
      },
    })

    return {
      items: data.data,
      meta: data.meta,
    }
  },

  async getById(id: string): Promise<WaiterCallDetail> {
    const { data } = await api.get<ApiSuccessResponse<WaiterCallDetail>>(`/waiter-calls/${id}`)
    return data.data
  },

  async updateStatus(id: string, status: WaiterCallStatus): Promise<WaiterCallStatusUpdated> {
    const { data } = await api.patch<ApiSuccessResponse<WaiterCallStatusUpdated>>(
      `/waiter-calls/${id}/status`,
      { status },
    )
    return data.data
  },
}
