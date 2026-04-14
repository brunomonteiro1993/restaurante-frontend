import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import { waiterCallsService } from '@/features/waiter-calls/services/waiter-calls.service'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'

interface MutationInput {
  id: string
  status: WaiterCallStatus
}

export const useUpdateWaiterCallStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: MutationInput) => waiterCallsService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status do chamado atualizado.')
      queryClient.invalidateQueries({ queryKey: ['waiter-calls'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar o chamado.')
        return
      }
      toast.error('Nao foi possivel atualizar o chamado.')
    },
  })
}
