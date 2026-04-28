import { useQuery } from '@tanstack/react-query'

import { productsService } from '@/features/products/services/products.service'

export const useProductCategoryOptions = () =>
  useQuery({
    queryKey: ['categories', 'options', 'products-form'],
    queryFn: () => productsService.listCategoryOptions(),
    staleTime: 60_000,
  })
