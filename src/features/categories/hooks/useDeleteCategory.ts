import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { categoriesService } from '@/features/categories/services/categories.service'

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: (_data, id) => {
      toast.success('Categoria excluida.')
      queryClient.invalidateQueries({ queryKey: ['categories', 'list'] })
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(id) })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel excluir a categoria.')
        return
      }
      toast.error('Nao foi possivel excluir a categoria.')
    },
  })
}
