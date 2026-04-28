import type { UserRole } from '@/features/auth/types/auth.types'
import type { UserStatusFilter } from '@/features/users/types/users.types'

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
    <div className="grid gap-3 rounded-lg border bg-background p-3 sm:grid-cols-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Busca</label>
        <input
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          placeholder="Nome ou email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Role</label>
        <select
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
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
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <select
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as UserStatusFilter)}
        >
          <option value="ALL">Todos</option>
          <option value="ACTIVE">Ativos</option>
          <option value="INACTIVE">Inativos</option>
        </select>
      </div>
    </div>
  )
}
