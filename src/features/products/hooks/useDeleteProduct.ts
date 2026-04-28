import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { productsService } from '@/features/products/services/products.service'

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsService.remove(id),
    onSuccess: (_data, id) => {
      toast.success('Produto excluido.')
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel excluir o produto.')
        return
      }
      toast.error('Nao foi possivel excluir o produto.')
    },
  })
}
