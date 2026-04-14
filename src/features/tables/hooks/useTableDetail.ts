import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { tablesService } from '@/features/tables/services/tables.service'

export const useTableDetail = (id: string | null, enabled: boolean) =>
  useQuery({
    queryKey: id ? queryKeys.tables.detail(id) : ['tables', 'detail', 'none'],
    queryFn: () => tablesService.getById(id!),
    enabled: Boolean(id) && enabled,
  })
