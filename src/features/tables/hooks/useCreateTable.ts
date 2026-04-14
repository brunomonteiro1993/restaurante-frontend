import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { tablesService } from '@/features/tables/services/tables.service'
import type { CreateTablePayload } from '@/features/tables/types/tables.types'

export const useCreateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTablePayload) => tablesService.create(payload),
    onSuccess: () => {
      toast.success('Mesa criada.')
      queryClient.invalidateQueries({ queryKey: ['tables', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel criar a mesa.')
        return
      }
      toast.error('Nao foi possivel criar a mesa.')
    },
  })
}
