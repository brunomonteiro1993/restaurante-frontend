import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { OrderStatus } from '@/features/orders/types/orders.types'

type StatusFilter = 'ALL' | OrderStatus

interface OrderFiltersProps {
  status: StatusFilter
  tableId: string
  search: string
  dateFrom: string
  dateTo: string
  onStatusChange: (v: StatusFilter) => void
  onTableIdChange: (v: string) => void
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
  tableId,
  search,
  dateFrom,
  dateTo,
  onStatusChange,
  onTableIdChange,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
}: OrderFiltersProps) {
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 sm:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">Busca (nome do cliente ou UUID do pedido)</p>
          <Input
            placeholder="Ex.: Joao ou UUID completo"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Mesa (UUID)</p>
          <Input
            placeholder="Opcional"
            value={tableId}
            onChange={(e) => onTableIdChange(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Criado de / ate</p>
          <div className="flex gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
            <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}
