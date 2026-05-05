import { api } from '@/services/api'
import type { ApiSuccessResponse } from '@/features/auth/types/auth.types'
import type { RestaurantProfile } from '@/features/restaurant/types/restaurant.types'

export const restaurantService = {
  async getMe(): Promise<RestaurantProfile> {
    const { data } = await api.get<ApiSuccessResponse<RestaurantProfile>>('/restaurants/me')
    return data.data
  },
}
