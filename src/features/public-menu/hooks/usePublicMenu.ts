import { useQuery } from '@tanstack/react-query'

import { publicMenuService } from '@/features/public-menu/services/public-menu.service'

export const usePublicMenu = (restaurantSlug?: string, tableCode?: string) =>
  useQuery({
    queryKey: ['public-menu', restaurantSlug ?? '', tableCode ?? ''],
    queryFn: () => publicMenuService.getByRestaurantAndTable(restaurantSlug!, tableCode!),
    enabled: Boolean(restaurantSlug) && Boolean(tableCode),
  })
