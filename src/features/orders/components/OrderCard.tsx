import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderActionButtons } from '@/features/orders/components/OrderActionButtons'
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge'
import type { OrderListItem } from '@/features/orders/types/orders.types'
import { formatCurrency, formatDateTime } from '@/utils/format'

interface OrderCardProps {
  order: OrderListItem
  onDetails: () => void
}

export function OrderCard({ order, onDetails }: OrderCardProps) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Mesa {order.table.number}</CardTitle>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          {/* <span className="font-mono text-[11px]">#{order.id.slice(0, 8)}</span> */}
          <span>{order.customerName ?? 'Cliente nao informado'}</span>
          <span>Criado em {formatDateTime(order.createdAt)}</span>
          <span className="font-medium text-foreground">Total {formatCurrency(order.total)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onDetails}>
            Detalhes
          </Button>
          <OrderActionButtons orderId={order.id} status={order.status} compact />
        </div>
      </CardContent>
    </Card>
  )
}
