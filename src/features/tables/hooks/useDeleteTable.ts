import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { tablesService } from '@/features/tables/services/tables.service'

export const useDeleteTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tablesService.remove(id),
    onSuccess: (_data, id) => {
      toast.success('Mesa excluida.')
      queryClient.invalidateQueries({ queryKey: ['tables', 'list'] })
      queryClient.removeQueries({ queryKey: queryKeys.tables.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel excluir a mesa.')
        return
      }
      toast.error('Nao foi possivel excluir a mesa.')
    },
  })
}
