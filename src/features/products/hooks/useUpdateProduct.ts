import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { productsService } from '@/features/products/services/products.service'
import type { UpdateProductPayload } from '@/features/products/types/products.types'

interface MutationInput {
  id: string
  payload: UpdateProductPayload
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: MutationInput) => productsService.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success('Produto atualizado.')
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar o produto.')
        return
      }
      toast.error('Nao foi possivel atualizar o produto.')
    },
  })
}
