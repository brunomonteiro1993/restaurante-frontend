import { Badge } from '@/components/ui/badge'
import type { BillStatus } from '@/features/bills/types/bills.types'
import { statusBadgeClass } from '@/lib/status-badge'

interface BillStatusBadgeProps {
  status: BillStatus
}

const config: Record<BillStatus, { label: string; className: string }> = {
  OPEN: { label: 'Aberta', className: statusBadgeClass.open },
  CLOSED: { label: 'Fechada', className: statusBadgeClass.closed },
  PAID: { label: 'Paga', className: statusBadgeClass.paid },
  CANCELLED: { label: 'Cancelada', className: statusBadgeClass.cancelled },
}

export function BillStatusBadge({ status }: BillStatusBadgeProps) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>
}
