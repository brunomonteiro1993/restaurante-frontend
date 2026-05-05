import { Badge } from '@/components/ui/badge'
import type { TableStatus } from '@/features/tables/types/tables.types'
import { statusBadgeClass } from '@/lib/status-badge'

interface TableStatusBadgeProps {
  status: TableStatus
}

const config: Record<TableStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Disponivel', className: statusBadgeClass.available },
  OCCUPIED: { label: 'Ocupada', className: statusBadgeClass.occupied },
  RESERVED: { label: 'Reservada', className: statusBadgeClass.reserved },
  DISABLED: { label: 'Indisponivel', className: statusBadgeClass.disabled },
}

export function TableStatusBadge({ status }: TableStatusBadgeProps) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>
}
