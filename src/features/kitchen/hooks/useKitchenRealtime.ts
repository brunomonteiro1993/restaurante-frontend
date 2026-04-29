import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { OrderStatus, OrderTableRef } from '@/features/orders/types/orders.types'
import { queryKeys } from '@/lib/query-keys'
import { socketService } from '@/services/socket'

/** Eventos emitidos pelo backend na room `kitchen:{restaurantId}` (JWT define o restaurante). */
const ORDER_CREATED = 'order.created' as const
const ORDER_STATUS_UPDATED = 'order.status.updated' as const

export interface KitchenOrderCreatedPayload {
  id: string
  status: OrderStatus
  customerName: string | null
  total: number
  createdAt: string
  table: OrderTableRef
}

export interface KitchenOrderStatusUpdatedPayload {
  id: string
  status: OrderStatus
  updatedAt: string
  table: OrderTableRef
}

/**
 * Assina eventos de pedido na cozinha (socket já autenticado via JWT no handshake).
 * Remove listeners no unmount para evitar duplicatas ao remontar a página.
 */
export function useKitchenRealtime(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = socketService.connect()
    if (!socket) return

    const invalidateKitchenOrders = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.kitchen.orders })
    }

    const onOrderCreated = (_payload: KitchenOrderCreatedPayload) => {
      invalidateKitchenOrders()
      toast.info('Novo pedido recebido')
    }

    const onOrderStatusUpdated = (_payload: KitchenOrderStatusUpdatedPayload) => {
      invalidateKitchenOrders()
    }

    socket.on(ORDER_CREATED, onOrderCreated)
    socket.on(ORDER_STATUS_UPDATED, onOrderStatusUpdated)

    return () => {
      socket.off(ORDER_CREATED, onOrderCreated)
      socket.off(ORDER_STATUS_UPDATED, onOrderStatusUpdated)
    }
  }, [queryClient])
}
