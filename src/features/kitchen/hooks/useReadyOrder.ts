import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import { kitchenService } from '@/features/kitchen/services/kitchen.service'

export const useReadyOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: kitchenService.readyOrder,
    onSuccess: () => {
      toast.success('Pedido marcado como pronto.')
      queryClient.invalidateQueries({ queryKey: queryKeys.kitchen.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: () => {
      toast.error('Nao foi possivel marcar o pedido como pronto.')
    },
  })
}
