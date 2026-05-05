import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/features/orders/types/orders.types'
import { statusBadgeClass } from '@/lib/status-badge'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const config: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendente', className: statusBadgeClass.pending },
  PREPARING: { label: 'Em preparo', className: statusBadgeClass.preparing },
  READY: { label: 'Pronto', className: statusBadgeClass.ready },
  DELIVERED: { label: 'Entregue', className: statusBadgeClass.delivered },
  CANCELLED: { label: 'Cancelado', className: statusBadgeClass.cancelled },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>
}
