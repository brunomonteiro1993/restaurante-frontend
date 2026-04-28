import { Button } from '@/components/ui/button'
import { usePermission } from '@/features/auth/permissions/usePermission'
import { useDeliverOrder } from '@/features/orders/hooks/useDeliverOrder'
import { useUpdateOrderStatus } from '@/features/orders/hooks/useUpdateOrderStatus'
import type { OrderStatus } from '@/features/orders/types/orders.types'

interface OrderActionButtonsProps {
  orderId: string
  status: OrderStatus
  compact?: boolean
}

export function OrderActionButtons({ orderId, status, compact }: OrderActionButtonsProps) {
  const { can } = usePermission()
  const updateMutation = useUpdateOrderStatus()
  const deliverMutation = useDeliverOrder()
  const canUpdateStatus = can('orders.updateStatus')
  const canDeliver = can('orders.deliver')

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
