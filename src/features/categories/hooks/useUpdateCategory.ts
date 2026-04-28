import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { categoriesService } from '@/features/categories/services/categories.service'
import type { UpdateCategoryPayload } from '@/features/categories/types/categories.types'

interface MutationInput {
  id: string
  payload: UpdateCategoryPayload
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: MutationInput) => categoriesService.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success('Categoria atualizada.')
      queryClient.invalidateQueries({ queryKey: ['categories', 'list'] })
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(variables.id),
      })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar a categoria.')
        return
      }
      toast.error('Nao foi possivel atualizar a categoria.')
    },
  })
}
