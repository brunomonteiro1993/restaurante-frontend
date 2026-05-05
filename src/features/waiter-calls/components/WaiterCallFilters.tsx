import { FiltersPanel } from '@/components/shared/filters-panel'
import { Button } from '@/components/ui/button'
import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'

type WaiterCallFilterOption = 'ALL' | WaiterCallStatus

interface WaiterCallFiltersProps {
  value: WaiterCallFilterOption
  onChange: (value: WaiterCallFilterOption) => void
}

const filters: Array<{ label: string; value: WaiterCallFilterOption }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Abertos', value: 'OPEN' },
  { label: 'Em atendimento', value: 'ANSWERED' },
  { label: 'Fechados', value: 'CLOSED' },
]

export function WaiterCallFilters({ value, onChange }: WaiterCallFiltersProps) {
  return (
    <FiltersPanel>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            variant={value === filter.value ? 'default' : 'outline'}
            onClick={() => onChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </FiltersPanel>
  )
}
