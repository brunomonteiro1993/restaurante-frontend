import { useQuery } from '@tanstack/react-query'

import { publicWaiterCallService } from '@/features/public-waiter-call/services/public-waiter-call.service'

export const usePublicWaiterCallStatus = (restaurantSlug?: string, tableCode?: string) =>
  useQuery({
    queryKey: ['public-waiter-call', 'status', restaurantSlug ?? '', tableCode ?? ''],
    queryFn: () => publicWaiterCallService.getPublicWaiterCallStatus(restaurantSlug!, tableCode!),
    enabled: Boolean(restaurantSlug) && Boolean(tableCode),
  })
