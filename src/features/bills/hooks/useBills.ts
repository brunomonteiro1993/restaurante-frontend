import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { billsService } from '@/features/bills/services/bills.service'
import type { BillFilters } from '@/features/bills/types/bills.types'

export const useBills = (filters: BillFilters) =>
  useQuery({
    queryKey: queryKeys.bills.list(filters),
    queryFn: () => billsService.list(filters),
  })
