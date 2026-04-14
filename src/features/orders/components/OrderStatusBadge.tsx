import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/features/orders/types/orders.types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const config: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendente', className: 'bg-amber-100 text-amber-900 hover:bg-amber-100' },
  PREPARING: { label: 'Em preparo', className: 'bg-blue-100 text-blue-900 hover:bg-blue-100' },
  READY: { label: 'Pronto', className: 'bg-violet-100 text-violet-900 hover:bg-violet-100' },
  DELIVERED: { label: 'Entregue', className: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100' },
  CANCELLED: { label: 'Cancelado', className: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200' },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>
}
