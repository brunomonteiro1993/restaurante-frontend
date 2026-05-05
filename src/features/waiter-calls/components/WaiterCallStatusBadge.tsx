import { Badge } from '@/components/ui/badge'
import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'
import { statusBadgeClass } from '@/lib/status-badge'

interface WaiterCallStatusBadgeProps {
  status: WaiterCallStatus
}

const statusConfig: Record<WaiterCallStatus, { label: string; className: string }> = {
  OPEN: { label: 'Aberto', className: statusBadgeClass.open },
  ANSWERED: { label: 'Em atendimento', className: statusBadgeClass.answered },
  CLOSED: { label: 'Fechado', className: statusBadgeClass.closed },
}

export function WaiterCallStatusBadge({ status }: WaiterCallStatusBadgeProps) {
  return <Badge className={statusConfig[status].className}>{statusConfig[status].label}</Badge>
}
