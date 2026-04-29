import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'
import { queryKeys } from '@/lib/query-keys'
import { socketService } from '@/services/socket'

const WAITER_CALL_CREATED = 'waiterCall.created' as const
const WAITER_CALL_STATUS_UPDATED = 'waiterCall.status.updated' as const

/** Alinhado ao payload de `waiterCall.created` do backend. */
export interface WaiterCallCreatedSocketPayload {
  id: string
  status: WaiterCallStatus
  createdAt: string
  table: {
    id: string
    number: string
  }
}

/** Alinhado ao payload de `waiterCall.status.updated` do backend. */
export interface WaiterCallStatusUpdatedSocketPayload {
  id: string
  status: WaiterCallStatus
  updatedAt: string
}

/**
 * Assina eventos de chamados de garçom no socket já autenticado (JWT no handshake).
 * Invalida todas as variantes da lista (`['waiter-calls', 'list']`, igual às mutations).
 */
export function useWaiterCallsRealtime(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = socketService.connect()
    if (!socket) return

    const invalidateListsAndDashboard = () => {
      void queryClient.invalidateQueries({ queryKey: ['waiter-calls', 'list'] })
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    }

    const onCreated = (_payload: WaiterCallCreatedSocketPayload) => {
      invalidateListsAndDashboard()
      toast.info('Novo chamado de garçom')
    }

    const onStatusUpdated = (_payload: WaiterCallStatusUpdatedSocketPayload) => {
      invalidateListsAndDashboard()
    }

    socket.on(WAITER_CALL_CREATED, onCreated)
    socket.on(WAITER_CALL_STATUS_UPDATED, onStatusUpdated)

    return () => {
      socket.off(WAITER_CALL_CREATED, onCreated)
      socket.off(WAITER_CALL_STATUS_UPDATED, onStatusUpdated)
    }
  }, [queryClient])
}
