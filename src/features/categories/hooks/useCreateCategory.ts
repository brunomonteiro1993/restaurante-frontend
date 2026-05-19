import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { categoriesService } from '@/features/categories/services/categories.service'
import type { CreateCategoryPayload } from '@/features/categories/types/categories.types'

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesService.create(payload),
    onSuccess: () => {
      toast.success('Categoria criada.')
      queryClient.invalidateQueries({ queryKey: ['categories', 'list'] })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel criar a categoria.')
        return
      }
      toast.error('Nao foi possivel criar a categoria.')
    },
  })
}
