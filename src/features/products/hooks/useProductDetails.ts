import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { productsService } from '@/features/products/services/products.service'

export const useProductDetails = (id: string | null, enabled: boolean) =>
  useQuery({
    queryKey: id ? queryKeys.products.detail(id) : ['products', 'detail', 'none'],
    queryFn: () => productsService.getById(id!),
    enabled: Boolean(id) && enabled,
  })
