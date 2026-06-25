import { FiltersPanel } from '@/components/shared/filters-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BillStatus } from '@/features/bills/types/bills.types'

type StatusFilter = 'ALL' | BillStatus

interface BillFiltersProps {
  status: StatusFilter
  tableId: string
  dateFrom: string
  dateTo: string
  onStatusChange: (v: StatusFilter) => void
  onTableIdChange: (v: string) => void
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
}

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Aberta', value: 'OPEN' },
  { label: 'Fechada', value: 'CLOSED' },
  { label: 'Paga', value: 'PAID' },
  { label: 'Cancelada', value: 'CANCELLED' },
]

export function BillFilters({
  status,
  tableId,
  dateFrom,
  dateTo,
  onStatusChange,
  onTableIdChange,
  onDateFromChange,
  onDateToChange,
}: BillFiltersProps) {
  return (
    <FiltersPanel>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Mesa (UUID)</p>
          <Input
            placeholder="Filtrar por id da mesa"
            value={tableId}
            onChange={(e) => onTableIdChange(e.target.value)}
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            O backend filtra por <span className="font-mono">tableId</span>. Deixe vazio para todas.
          </p>
        </div> */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Abertura de</p>
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Abertura ate</p>
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
        </div>
      </div>
    </FiltersPanel>
  )
}
