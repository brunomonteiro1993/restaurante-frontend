import { Button } from '@/components/ui/button'
import { hasPermission } from '@/features/auth/role-permissions'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useDeliverOrder } from '@/features/orders/hooks/useDeliverOrder'
import { useUpdateOrderStatus } from '@/features/orders/hooks/useUpdateOrderStatus'
import type { OrderStatus } from '@/features/orders/types/orders.types'

interface OrderActionButtonsProps {
  orderId: string
  status: OrderStatus
  compact?: boolean
}

export function OrderActionButtons({ orderId, status, compact }: OrderActionButtonsProps) {
  const { user } = useAuth()
  const updateMutation = useUpdateOrderStatus()
  const deliverMutation = useDeliverOrder()

  if (!user) return null

  const canUpdateStatus = hasPermission(user.role, 'orders:updateStatus')
  const canDeliver = hasPermission(user.role, 'orders:deliver')

  const isUpdating = updateMutation.isPending && updateMutation.variables?.id === orderId
  const isDelivering = deliverMutation.isPending && deliverMutation.variables === orderId
  const busy = isUpdating || isDelivering

  if (status === 'DELIVERED' || status === 'CANCELLED') {
    return null
  }

  const size = compact ? 'sm' : 'default'

  const markDelivered = () => {
    if (canUpdateStatus) {
      updateMutation.mutate({ id: orderId, status: 'DELIVERED' })
    } else if (canDeliver) {
      deliverMutation.mutate(orderId)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canUpdateStatus && status === 'PENDING' && (
        <>
          <Button size={size} disabled={busy} onClick={() => updateMutation.mutate({ id: orderId, status: 'PREPARING' })}>
            {isUpdating ? '...' : 'Enviar p/ preparo'}
          </Button>
          <Button
            size={size}
            variant="outline"
            disabled={busy}
            onClick={() => updateMutation.mutate({ id: orderId, status: 'CANCELLED' })}
          >
            Cancelar
          </Button>
        </>
      )}

      {canUpdateStatus && status === 'PREPARING' && (
        <>
          <Button size={size} disabled={busy} onClick={() => updateMutation.mutate({ id: orderId, status: 'READY' })}>
            {isUpdating ? '...' : 'Marcar pronto'}
          </Button>
          <Button
            size={size}
            variant="outline"
            disabled={busy}
            onClick={() => updateMutation.mutate({ id: orderId, status: 'CANCELLED' })}
          >
            Cancelar
          </Button>
        </>
      )}

      {status === 'READY' && (canUpdateStatus || canDeliver) && (
        <Button size={size} disabled={busy} onClick={markDelivered}>
          {busy ? '...' : 'Marcar como entregue'}
        </Button>
      )}
    </div>
  )
}
