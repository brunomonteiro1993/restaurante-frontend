import { Badge } from '@/components/ui/badge'
import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'

interface WaiterCallStatusBadgeProps {
  status: WaiterCallStatus
}

const statusConfig: Record<WaiterCallStatus, { label: string; className: string }> = {
  OPEN: { label: 'Aberto', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
  ANSWERED: { label: 'Em atendimento', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  CLOSED: { label: 'Fechado', className: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200' },
}

export function WaiterCallStatusBadge({ status }: WaiterCallStatusBadgeProps) {
  return <Badge className={statusConfig[status].className}>{statusConfig[status].label}</Badge>
}
