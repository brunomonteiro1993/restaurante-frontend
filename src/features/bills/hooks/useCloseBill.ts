import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { billsService } from '@/features/bills/services/bills.service'
import type { CloseBillPayload } from '@/features/bills/types/bills.types'

interface MutationInput {
  id: string
  tableId: string
  payload: CloseBillPayload
}

export const useCloseBill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: MutationInput) => billsService.closeBill(id, payload),
    onSuccess: (_data, variables) => {
      toast.success('Conta fechada.')
      queryClient.invalidateQueries({ queryKey: ['bills', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.currentTable(variables.tableId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
      queryClient.invalidateQueries({ queryKey: ['waiter-calls', 'list'] })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel fechar a conta.')
        return
      }
      toast.error('Nao foi possivel fechar a conta.')
    },
  })
}
