import { FiltersPanel } from '@/components/shared/filters-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  ProductAvailabilityFilter,
  ProductCategoryOption,
} from '@/features/products/types/products.types'

interface ProductFiltersProps {
  availabilityFilter: ProductAvailabilityFilter
  search: string
  categoryId: string
  categoryOptions: ProductCategoryOption[]
  categoriesLoading: boolean
  onAvailabilityFilterChange: (value: ProductAvailabilityFilter) => void
  onSearchChange: (value: string) => void
  onCategoryIdChange: (value: string) => void
}

const availabilityOptions: Array<{ label: string; value: ProductAvailabilityFilter }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Disponiveis', value: 'AVAILABLE' },
  { label: 'Indisponiveis', value: 'UNAVAILABLE' },
]

export function ProductFilters({
  availabilityFilter,
  search,
  categoryId,
  categoryOptions,
  categoriesLoading,
  onAvailabilityFilterChange,
  onSearchChange,
  onCategoryIdChange,
}: ProductFiltersProps) {
  return (
    <FiltersPanel>
      <div className="flex flex-wrap gap-2">
        {availabilityOptions.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={availabilityFilter === opt.value ? 'default' : 'outline'}
            onClick={() => onAvailabilityFilterChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Busca por nome</p>
          <Input
            placeholder="Ex.: Pizza"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Categoria</p>
          <select
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            value={categoryId}
            onChange={(e) => onCategoryIdChange(e.target.value)}
            disabled={categoriesLoading}
          >
            <option value="">Todas</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FiltersPanel>
  )
}
