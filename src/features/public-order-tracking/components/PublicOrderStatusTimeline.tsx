import type { PublicTrackableOrderStatus } from '@/features/public-order-tracking/types/public-order-tracking.types'

const STEPS: Array<{ key: PublicTrackableOrderStatus; label: string }> = [
  { key: 'PENDING', label: 'Pedido recebido' },
  { key: 'PREPARING', label: 'Em preparo' },
  { key: 'READY', label: 'Pronto para entrega' },
  { key: 'DELIVERED', label: 'Entregue' },
]

interface PublicOrderStatusTimelineProps {
  status: PublicTrackableOrderStatus
}

export function PublicOrderStatusTimeline({ status }: PublicOrderStatusTimelineProps) {
  if (status === 'CANCELLED') {
    return <p className="text-sm font-medium text-destructive">Pedido cancelado.</p>
  }

  const currentIdx = STEPS.findIndex((step) => step.key === status)

  return (
    <div className="space-y-2">
      {STEPS.map((step, idx) => {
        const reached = idx <= currentIdx
        return (
          <div key={step.key} className="flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${reached ? 'bg-primary' : 'bg-muted-foreground/30'}`}
            />
            <span className={reached ? 'font-medium text-foreground' : 'text-muted-foreground'}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
