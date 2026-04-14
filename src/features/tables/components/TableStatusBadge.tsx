import { Badge } from '@/components/ui/badge'
import type { TableStatus } from '@/features/tables/types/tables.types'

interface TableStatusBadgeProps {
  status: TableStatus
}

const config: Record<TableStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Disponivel', className: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100' },
  OCCUPIED: { label: 'Ocupada', className: 'bg-amber-100 text-amber-900 hover:bg-amber-100' },
  RESERVED: { label: 'Reservada', className: 'bg-blue-100 text-blue-900 hover:bg-blue-100' },
  DISABLED: { label: 'Indisponivel', className: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200' },
}

export function TableStatusBadge({ status }: TableStatusBadgeProps) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>
}
