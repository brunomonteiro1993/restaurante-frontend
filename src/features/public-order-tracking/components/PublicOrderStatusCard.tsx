import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicOrderItemsSummary } from '@/features/public-order-tracking/components/PublicOrderItemsSummary'
import { PublicOrderStatusTimeline } from '@/features/public-order-tracking/components/PublicOrderStatusTimeline'
import type {
  PublicLastOrderSnapshot,
  PublicOrderTrackingResult,
} from '@/features/public-order-tracking/types/public-order-tracking.types'
import { formatCurrency, formatDateTime } from '@/utils/format'

interface PublicOrderStatusCardProps {
  lastOrder: PublicLastOrderSnapshot
  trackingData?: PublicOrderTrackingResult
}

export function PublicOrderStatusCard({
  lastOrder,
  trackingData,
}: PublicOrderStatusCardProps) {
  const status = trackingData?.status ?? lastOrder.status

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Acompanhamento do pedido</CardTitle>
          <Badge>{status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Pedido #{lastOrder.orderId.slice(0, 8)} • Enviado em {formatDateTime(lastOrder.createdAt)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <PublicOrderStatusTimeline status={status} />

        {trackingData?.items && trackingData.items.length > 0 && (
          <>
            <p className="text-sm font-medium">Itens</p>
            <PublicOrderItemsSummary items={trackingData.items} />
          </>
        )}

        {typeof trackingData?.total === 'number' && (
          <p className="text-sm font-medium">Total: {formatCurrency(trackingData.total)}</p>
        )}
      </CardContent>
    </Card>
  )
}
