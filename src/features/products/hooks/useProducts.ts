import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { productsService } from '@/features/products/services/products.service'
import type { ProductListFilters } from '@/features/products/types/products.types'

export const useProducts = (filters: ProductListFilters) =>
  useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.list(filters),
  })
