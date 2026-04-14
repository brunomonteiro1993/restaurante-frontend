import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { ordersService } from '@/features/orders/services/orders.service'
import type { OrderStatus } from '@/features/orders/types/orders.types'

interface MutationInput {
  id: string
  status: OrderStatus
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: MutationInput) => ordersService.updateStatus(id, { status }),
    onSuccess: (_data, variables) => {
      toast.success('Status do pedido atualizado.')
      queryClient.invalidateQueries({ queryKey: ['orders', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.kitchen.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar o pedido.')
        return
      }
      toast.error('Nao foi possivel atualizar o pedido.')
    },
  })
}
