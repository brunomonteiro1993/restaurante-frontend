import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { ordersService } from '@/features/orders/services/orders.service'

export const useOrderDetails = (orderId: string | null, enabled: boolean) =>
  useQuery({
    queryKey: orderId ? queryKeys.orders.detail(orderId) : ['orders', 'detail', 'none'],
    queryFn: () => ordersService.getById(orderId!),
    enabled: Boolean(orderId) && enabled,
  })
