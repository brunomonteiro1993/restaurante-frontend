import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { productsService } from '@/features/products/services/products.service'
import type { CreateProductPayload } from '@/features/products/types/products.types'

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsService.create(payload),
    onSuccess: () => {
      toast.success('Produto criado.')
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel criar o produto.')
        return
      }
      toast.error('Nao foi possivel criar o produto.')
    },
  })
}
