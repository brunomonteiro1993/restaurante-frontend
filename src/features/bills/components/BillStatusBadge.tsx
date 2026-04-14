import { Badge } from '@/components/ui/badge'
import type { BillStatus } from '@/features/bills/types/bills.types'

interface BillStatusBadgeProps {
  status: BillStatus
}

const config: Record<BillStatus, { label: string; className: string }> = {
  OPEN: { label: 'Aberta', className: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100' },
  CLOSED: { label: 'Fechada', className: 'bg-amber-100 text-amber-900 hover:bg-amber-100' },
  PAID: { label: 'Paga', className: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200' },
  CANCELLED: { label: 'Cancelada', className: 'bg-red-100 text-red-900 hover:bg-red-100' },
}

export function BillStatusBadge({ status }: BillStatusBadgeProps) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>
}
