import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { tablesService } from '@/features/tables/services/tables.service'
import type { TableListFilters } from '@/features/tables/types/tables.types'

export const useTables = (filters: TableListFilters) =>
  useQuery({
    queryKey: queryKeys.tables.list(filters),
    queryFn: () => tablesService.list(filters),
  })
