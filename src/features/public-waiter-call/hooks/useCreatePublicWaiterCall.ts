import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { publicWaiterCallService } from '@/features/public-waiter-call/services/public-waiter-call.service'
import type { CreatePublicWaiterCallPayload } from '@/features/public-waiter-call/types/public-waiter-call.types'

export const useCreatePublicWaiterCall = (restaurantSlug: string, tableCode: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePublicWaiterCallPayload) =>
      publicWaiterCallService.createPublicWaiterCall(payload),
    onSuccess: (data) => {
      if (data.alreadyOpen) {
        toast.info('Ja existe um chamado aberto para esta mesa.')
      } else {
        toast.success('Garcom chamado com sucesso.')
      }
      queryClient.invalidateQueries({
        queryKey: ['public-waiter-call', 'status', restaurantSlug, tableCode],
      })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel chamar o garcom.')
        return
      }
      toast.error('Nao foi possivel chamar o garcom.')
    },
  })
}
