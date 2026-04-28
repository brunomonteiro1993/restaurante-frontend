import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CategoryActiveFilter } from '@/features/categories/types/categories.types'

interface CategoryFiltersProps {
  activeFilter: CategoryActiveFilter
  search: string
  onActiveFilterChange: (value: CategoryActiveFilter) => void
  onSearchChange: (value: string) => void
}

const activeOptions: Array<{ label: string; value: CategoryActiveFilter }> = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Ativas', value: 'ACTIVE' },
  { label: 'Inativas', value: 'INACTIVE' },
]

export function CategoryFilters({
  activeFilter,
  search,
  onActiveFilterChange,
  onSearchChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {activeOptions.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={activeFilter === opt.value ? 'default' : 'outline'}
            onClick={() => onActiveFilterChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="max-w-md space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Busca por nome</p>
        <Input
          placeholder="Ex.: Bebidas"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
