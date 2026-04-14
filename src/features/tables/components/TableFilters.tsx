import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TableStatusFilter } from '@/features/tables/types/tables.types'

interface TableFiltersProps {
  status: TableStatusFilter
  search: string
  onStatusChange: (v: TableStatusFilter) => void
  onSearchChange: (v: string) => void
}

const statusOptions: Array<{ label: string; value: TableStatusFilter }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Disponivel', value: 'AVAILABLE' },
  { label: 'Ocupada', value: 'OCCUPIED' },
  { label: 'Reservada', value: 'RESERVED' },
  { label: 'Indisponivel', value: 'DISABLED' },
]

export function TableFilters({ status, search, onStatusChange, onSearchChange }: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={status === opt.value ? 'default' : 'outline'}
            onClick={() => onStatusChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <div className="max-w-md space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Busca por numero da mesa</p>
        <Input placeholder="Ex.: 1 ou 12" value={search} onChange={(e) => onSearchChange(e.target.value)} />
        {status !== 'ALL' && (
          <p className="text-[11px] text-muted-foreground">
            Filtro por status aplica na lista carregada (o endpoint nao filtra por status; com status diferente de
            &quot;Todos&quot; os dados sao agregados no cliente).
          </p>
        )}
      </div>
    </div>
  )
}
