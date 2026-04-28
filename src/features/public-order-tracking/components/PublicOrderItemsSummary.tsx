import type { PublicOrderTrackingResult } from '@/features/public-order-tracking/types/public-order-tracking.types'

interface PublicOrderItemsSummaryProps {
  items: PublicOrderTrackingResult['items']
}

export function PublicOrderItemsSummary({ items }: PublicOrderItemsSummaryProps) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground">Itens indisponiveis neste momento.</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={`${item.name}-${idx}`} className="rounded-md border p-2 text-sm">
          <p className="font-medium">
            {item.quantity}x {item.name}
          </p>
          {item.notes && <p className="text-xs text-muted-foreground">Obs.: {item.notes}</p>}
        </div>
      ))}
    </div>
  )
}
