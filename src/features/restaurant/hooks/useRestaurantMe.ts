import { useQuery } from '@tanstack/react-query'

import { restaurantService } from '@/features/restaurant/services/restaurant.service'

export const useRestaurantMe = () =>
  useQuery({
    queryKey: ['restaurant', 'me'],
    queryFn: restaurantService.getMe,
  })
