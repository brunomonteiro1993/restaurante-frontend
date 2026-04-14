import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { tablesService } from '@/features/tables/services/tables.service'
import type { UpdateTablePayload } from '@/features/tables/types/tables.types'

interface MutationInput {
  id: string
  payload: UpdateTablePayload
}

export const useUpdateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: MutationInput) => tablesService.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success('Mesa atualizada.')
      queryClient.invalidateQueries({ queryKey: ['tables', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar a mesa.')
        return
      }
      toast.error('Nao foi possivel atualizar a mesa.')
    },
  })
}
