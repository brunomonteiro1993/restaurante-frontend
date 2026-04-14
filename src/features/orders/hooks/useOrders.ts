import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { ordersService } from '@/features/orders/services/orders.service'
import type { OrderFilters } from '@/features/orders/types/orders.types'

export const useOrders = (filters: OrderFilters) =>
  useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersService.list(filters),
  })
