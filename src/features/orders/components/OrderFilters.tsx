import { FiltersPanel } from '@/components/shared/filters-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { OrderStatus } from '@/features/orders/types/orders.types'

type StatusFilter = 'ALL' | OrderStatus

interface OrderFiltersProps {
  status: StatusFilter
  tableNumber: string
  search: string
  dateFrom: string
  dateTo: string
  onStatusChange: (v: StatusFilter) => void
  onTableNumberChange: (v: string) => void
  onSearchChange: (v: string) => void
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
}

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Em preparo', value: 'PREPARING' },
  { label: 'Pronto', value: 'READY' },
  { label: 'Entregue', value: 'DELIVERED' },
  { label: 'Cancelado', value: 'CANCELLED' },
]

export function OrderFilters({
  status,
  tableNumber,
  search,
  dateFrom,
  dateTo,
  onStatusChange,
  onTableNumberChange,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
}: OrderFiltersProps) {
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
        <div className="space-y-1.5 sm:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">Busca (nome do cliente)</p>
          <Input
            placeholder="Ex.: Joao"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Numero da mesa</p>
          <Input
            placeholder="Ex.: 1 ou 12"
            autoComplete="off"
            value={tableNumber}
            onChange={(e) => onTableNumberChange(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Criado de / ate</p>
          <div className="flex gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
            <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
          </div>
        </div>
      </div>
    </FiltersPanel>
  )
}
