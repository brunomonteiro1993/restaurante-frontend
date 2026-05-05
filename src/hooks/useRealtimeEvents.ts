import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { BillStatus, PaymentMethod } from '@/features/bills/types/bills.types'
import type { OrderStatus } from '@/features/orders/types/orders.types'
import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'
import { queryKeys } from '@/lib/query-keys'
import { socketService } from '@/services/socket'

const ORDER_CREATED = 'order.created' as const
const ORDER_STATUS_UPDATED = 'order.status.updated' as const
const WAITER_CALL_CREATED = 'waiterCall.created' as const
const WAITER_CALL_STATUS_UPDATED = 'waiterCall.status.updated' as const
const BILL_CLOSED = 'bill.closed' as const
const BILL_PAID = 'bill.paid' as const

interface RealtimeTableRef {
  id: string
  number: string
}

interface OrderCreatedPayload {
  id: string
  status: OrderStatus
  customerName: string | null
  total: number
  createdAt: string
  table: RealtimeTableRef
}

interface OrderStatusUpdatedPayload {
  id: string
  status: OrderStatus
  updatedAt: string
  table: RealtimeTableRef
}

interface WaiterCallCreatedPayload {
  id: string
  status: WaiterCallStatus
  createdAt: string
  table: RealtimeTableRef
}

interface WaiterCallStatusUpdatedPayload {
  id: string
  status: WaiterCallStatus
  updatedAt: string
}

interface BillClosedPayload {
  id: string
  status: BillStatus
  total: number
  closedAt: string
  table: RealtimeTableRef
}

interface BillPaidPayload {
  id: string
  status: BillStatus
  total: number
  paidAt: string
  paymentMethod: PaymentMethod
  table: RealtimeTableRef
}

/**
 * Centraliza listeners de realtime na area autenticada para evitar listeners duplicados.
 * O backend define o tenant/room via JWT, sem necessidade de enviar restaurantId no frontend.
 */
export function useRealtimeEvents(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = socketService.connect()
    if (!socket) return

    const invalidateDashboardStats = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    }

    const invalidateKitchenOrders = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.kitchen.orders })
    }

    const invalidateOrdersList = () => {
      void queryClient.invalidateQueries({ queryKey: ['orders', 'list'] })
    }

    const invalidateWaiterCallsList = () => {
      void queryClient.invalidateQueries({ queryKey: ['waiter-calls', 'list'] })
    }

    const invalidateBillsList = () => {
      void queryClient.invalidateQueries({ queryKey: ['bills', 'list'] })
    }

    const invalidateBillDetail = (billId: string) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail(billId) })
    }

    const invalidateTablesList = () => {
      void queryClient.invalidateQueries({ queryKey: ['tables', 'list'] })
    }

    const onOrderCreated = (_payload: OrderCreatedPayload) => {
      invalidateDashboardStats()
      invalidateKitchenOrders()
      invalidateOrdersList()
      invalidateBillsList()
    }

    const onOrderStatusUpdated = (_payload: OrderStatusUpdatedPayload) => {
      invalidateDashboardStats()
      invalidateOrdersList()
      invalidateKitchenOrders()
      invalidateBillsList()
    }

    const onWaiterCallCreated = (_payload: WaiterCallCreatedPayload) => {
      invalidateDashboardStats()
      invalidateWaiterCallsList()
    }

    const onWaiterCallStatusUpdated = (_payload: WaiterCallStatusUpdatedPayload) => {
      invalidateDashboardStats()
      invalidateWaiterCallsList()
    }

    const onBillClosed = (payload: BillClosedPayload) => {
      invalidateDashboardStats()
      invalidateBillsList()
      invalidateBillDetail(payload.id)
      invalidateOrdersList()
      toast.success('Conta fechada')
    }

    const onBillPaid = (payload: BillPaidPayload) => {
      invalidateDashboardStats()
      invalidateBillsList()
      invalidateBillDetail(payload.id)
      invalidateTablesList()
      invalidateOrdersList()
      toast.success('Conta paga')
    }

    socket.on(ORDER_CREATED, onOrderCreated)
    socket.on(ORDER_STATUS_UPDATED, onOrderStatusUpdated)
    socket.on(WAITER_CALL_CREATED, onWaiterCallCreated)
    socket.on(WAITER_CALL_STATUS_UPDATED, onWaiterCallStatusUpdated)
    socket.on(BILL_CLOSED, onBillClosed)
    socket.on(BILL_PAID, onBillPaid)

    return () => {
      socket.off(ORDER_CREATED, onOrderCreated)
      socket.off(ORDER_STATUS_UPDATED, onOrderStatusUpdated)
      socket.off(WAITER_CALL_CREATED, onWaiterCallCreated)
      socket.off(WAITER_CALL_STATUS_UPDATED, onWaiterCallStatusUpdated)
      socket.off(BILL_CLOSED, onBillClosed)
      socket.off(BILL_PAID, onBillPaid)
    }
  }, [queryClient])
}
