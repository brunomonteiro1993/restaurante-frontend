import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { publicTableSocketService } from '@/services/public-table-socket'

const WAITER_CALL_CREATED = 'waiterCall.created' as const
const WAITER_CALL_STATUS_UPDATED = 'waiterCall.status.updated' as const

function statusQueryKey(restaurantSlug: string, tableCode: string) {
  return ['public-waiter-call', 'status', restaurantSlug, tableCode] as const
}

/**
 * Atualiza o estado do chamado no cardápio público quando o staff altera o status
 * ou quando há novo chamado (ex.: outro dispositivo na mesma mesa).
 */
export function usePublicWaiterCallRealtime(restaurantSlug: string, tableCode: string): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const sock = publicTableSocketService.connect(restaurantSlug, tableCode)
    if (!sock) return

    const invalidate = () => {
      void queryClient.invalidateQueries({
        queryKey: statusQueryKey(restaurantSlug, tableCode),
      })
    }

    const onCreated = () => {
      invalidate()
    }

    const onStatusUpdated = () => {
      invalidate()
    }

    sock.on(WAITER_CALL_CREATED, onCreated)
    sock.on(WAITER_CALL_STATUS_UPDATED, onStatusUpdated)

    return () => {
      sock.off(WAITER_CALL_CREATED, onCreated)
      sock.off(WAITER_CALL_STATUS_UPDATED, onStatusUpdated)
      publicTableSocketService.disconnect()
    }
  }, [queryClient, restaurantSlug, tableCode])
}
