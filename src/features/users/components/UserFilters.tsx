import type { UserRole } from '@/features/auth/types/auth.types'
import type { UserStatusFilter } from '@/features/users/types/users.types'

import { FiltersPanel } from '@/components/shared/filters-panel'
import { Input } from '@/components/ui/input'

const SELECT_CLASS =
  'flex h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50'

interface UserFiltersProps {
  search: string
  role: '' | UserRole
  statusFilter: UserStatusFilter
  onSearchChange: (value: string) => void
  onRoleChange: (value: '' | UserRole) => void
  onStatusFilterChange: (value: UserStatusFilter) => void
}

export function UserFilters({
  search,
  role,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusFilterChange,
}: UserFiltersProps) {
  return (
    <FiltersPanel>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="user-filters-search">
            Busca
          </label>
          <Input
            id="user-filters-search"
            placeholder="Nome ou email"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="user-filters-role">
            Role
          </label>
          <select
            id="user-filters-role"
            className={SELECT_CLASS}
            value={role}
            onChange={(e) => onRoleChange(e.target.value as '' | UserRole)}
          >
            <option value="">Todas</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Gerente</option>
            <option value="WAITER">Garcom</option>
            <option value="KITCHEN">Cozinha</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="user-filters-status">
            Status
          </label>
          <select
            id="user-filters-status"
            className={SELECT_CLASS}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as UserStatusFilter)}
          >
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </div>
      </div>
    </FiltersPanel>
  )
}
