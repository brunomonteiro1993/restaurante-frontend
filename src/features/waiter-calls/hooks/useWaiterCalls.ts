import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { waiterCallsService } from '@/features/waiter-calls/services/waiter-calls.service'
import type { WaiterCallFilters } from '@/features/waiter-calls/types/waiter-calls.types'

export const useWaiterCalls = (filters: WaiterCallFilters) =>
  useQuery({
    queryKey: queryKeys.waiterCalls.list(filters),
    queryFn: () => waiterCallsService.list(filters),
  })
