import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePermission } from '@/features/auth/permissions/usePermission'
import type { KitchenOrder } from '@/features/kitchen/types/kitchen.types'
import { formatCurrency, formatDateTime, formatTime } from '@/utils/format'

const statusMap: Record<
  KitchenOrder['status'],
  { label: string; className: string }
> = {
  PENDING: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  PREPARING: { label: 'Em preparo', className: 'bg-blue-100 text-blue-800' },
  READY: { label: 'Pronto', className: 'bg-emerald-100 text-emerald-800' },
  DELIVERED: { label: 'Entregue', className: 'bg-zinc-200 text-zinc-800' },
  CANCELLED: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
}

const statusBadge = (status: KitchenOrder['status']) =>
  statusMap[status] ?? { label: status, className: 'bg-muted text-foreground' }

interface KitchenOrderCardProps {
  order: KitchenOrder
  onStart: (orderId: string) => void
  onReady: (orderId: string) => void
  isPendingAction: boolean
}

export function KitchenOrderCard({ order, onStart, onReady, isPendingAction }: KitchenOrderCardProps) {
  const { can } = usePermission()
  const canStart = can('kitchen.start')
  const canReady = can('kitchen.ready')

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Pedido #{order.id.slice(0, 8)}</CardTitle>
          <Badge className={statusBadge(order.status).className}>{statusBadge(order.status).label}</Badge>
        </div>
        <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          <span>Mesa {order.table.number}</span>
          <span>Cliente: {order.customerName || 'Sem nome'}</span>
          <span>{formatDateTime(order.createdAt)}</span>
          <span>Hora: {formatTime(order.createdAt)}</span>
          <span className="sm:col-span-2">Total: {formatCurrency(order.total)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Itens</p>
          <ul className="space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.quantity}x {item.name || 'Produto'}
                </span>
                <span className="text-muted-foreground">{formatCurrency(item.totalPrice)}</span>
              </li>
            ))}
          </ul>
        </div>

        {order.notes && (
          <div className="rounded-md border border-dashed p-2 text-sm">
            <strong>Observacoes:</strong> {order.notes}
          </div>
        )}

        {order.status === 'PENDING' && canStart && (
          <Button onClick={() => onStart(order.id)} disabled={isPendingAction} className="w-full">
            {isPendingAction ? 'Iniciando...' : 'Iniciar preparo'}
          </Button>
        )}

        {order.status === 'PREPARING' && canReady && (
          <Button onClick={() => onReady(order.id)} disabled={isPendingAction} className="w-full">
            {isPendingAction ? 'Atualizando...' : 'Marcar como pronto'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
