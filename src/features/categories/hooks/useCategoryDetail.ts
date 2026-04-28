import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { categoriesService } from '@/features/categories/services/categories.service'

export const useCategoryDetail = (id: string | null, enabled: boolean) =>
  useQuery({
    queryKey: id ? queryKeys.categories.detail(id) : ['categories', 'detail', 'none'],
    queryFn: () => categoriesService.getById(id!),
    enabled: Boolean(id) && enabled,
  })
