import { api } from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api.types'
import type { PublicMenuResult } from '@/features/public-menu/types/public-menu.types'

export const publicMenuService = {
  async getByRestaurantAndTable(restaurantSlug: string, tableCode: string): Promise<PublicMenuResult> {
    const { data } = await api.get<ApiSuccessResponse<PublicMenuResult>>(
      `/public/menu/${encodeURIComponent(restaurantSlug)}/table/${encodeURIComponent(tableCode)}`,
    )
    return data.data
  },
}
