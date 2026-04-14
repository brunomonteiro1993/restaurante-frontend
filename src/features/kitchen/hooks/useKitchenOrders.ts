import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { kitchenService } from '@/features/kitchen/services/kitchen.service'

export const useKitchenOrders = () =>
  useQuery({
    queryKey: queryKeys.kitchen.orders,
    queryFn: kitchenService.listActiveOrders,
  })
