import { api } from '@/services/api'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.types'
import type {
  BillDetail,
  BillFilters,
  BillListItem,
  BillsListResult,
  CloseBillPayload,
  PayBillPayload,
} from '@/features/bills/types/bills.types'

const DEFAULT_LIMIT = 20

export const billsService = {
  async list(filters: BillFilters): Promise<BillsListResult> {
    const { page = 1, limit = DEFAULT_LIMIT, status, tableId, dateFrom, dateTo } = filters

    const { data } = await api.get<ApiPaginatedResponse<BillListItem>>('/bills', {
      params: {
        page,
        limit,
        ...(status ? { status } : {}),
        ...(tableId ? { tableId } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      },
    })

    return {
      items: data.data,
      meta: data.meta,
    }
  },

  async getCurrentByTable(tableId: string): Promise<BillDetail> {
    const { data } = await api.get<ApiSuccessResponse<BillDetail>>(`/bills/table/${tableId}/current`)
    return data.data
  },

  async closeBill(id: string, payload: CloseBillPayload): Promise<BillDetail> {
    const { data } = await api.patch<ApiSuccessResponse<BillDetail>>(`/bills/${id}/close`, payload)
    return data.data
  },

  async payBill(id: string, payload: PayBillPayload): Promise<BillDetail> {
    const { data } = await api.patch<ApiSuccessResponse<BillDetail>>(`/bills/${id}/pay`, payload)
    return data.data
  },
}
