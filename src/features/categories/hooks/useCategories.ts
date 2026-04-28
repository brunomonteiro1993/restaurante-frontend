import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { categoriesService } from '@/features/categories/services/categories.service'
import type { CategoryListFilters } from '@/features/categories/types/categories.types'

export const useCategories = (filters: CategoryListFilters) =>
  useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: () => categoriesService.list(filters),
  })
