import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { publicOrderService } from '@/features/public-order/services/public-order.service'
import type { CreatePublicOrderPayload } from '@/features/public-order/types/public-order.types'

export const useCreatePublicOrder = () =>
  useMutation({
    mutationFn: (payload: CreatePublicOrderPayload) =>
      publicOrderService.createPublicOrder(payload),
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel enviar o pedido.')
        return
      }
      toast.error('Nao foi possivel enviar o pedido.')
    },
  })
