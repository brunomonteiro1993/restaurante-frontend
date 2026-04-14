import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import { kitchenService } from '@/features/kitchen/services/kitchen.service'

export const useStartOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: kitchenService.startOrder,
    onSuccess: () => {
      toast.success('Preparo iniciado.')
      queryClient.invalidateQueries({ queryKey: queryKeys.kitchen.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
    onError: () => {
      toast.error('Nao foi possivel iniciar o preparo.')
    },
  })
}
