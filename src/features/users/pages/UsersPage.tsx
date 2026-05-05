import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermission } from '@/features/auth/permissions/usePermission'
import { CreateUserDialog } from '@/features/users/components/CreateUserDialog'
import { EditUserDialog } from '@/features/users/components/EditUserDialog'
import { ToggleUserStatusDialog } from '@/features/users/components/ToggleUserStatusDialog'
import { UserFilters } from '@/features/users/components/UserFilters'
import { UserList } from '@/features/users/components/UserList'
import { useUsers } from '@/features/users/hooks/useUsers'
import type { UserListFilters, UserListItem, UserStatusFilter } from '@/features/users/types/users.types'
import type { UserRole } from '@/features/auth/types/auth.types'

export function UsersPage() {
  const { can } = usePermission()
  const canManageUsers = can('users.manage')

  const [search, setSearch] = useState('')
  const [role, setRole] = useState<'' | UserRole>('')
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('ALL')
  const [page, setPage] = useState(1)
  const limit = 20

  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [toggleTarget, setToggleTarget] = useState<UserListItem | null>(null)
  const [toggleOpen, setToggleOpen] = useState(false)

  const filters: UserListFilters = useMemo(
    () => ({
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(role ? { role } : {}),
      statusFilter,
      ...(statusFilter === 'ALL' ? {} : { isActive: statusFilter === 'ACTIVE' }),
    }),
    [page, limit, search, role, statusFilter],
  )

  useEffect(() => {
    setPage(1)
  }, [search, role, statusFilter])

  const { data, isLoading, isError } = useUsers(filters)

  const users = data?.items ?? []
  const meta = data?.meta
  const listBusy = false

  return (
    <div className="space-y-4">
      <PageHeader
        title="Usuarios"
        subtitle="Gestao de usuarios internos do restaurante autenticado."
        rightSlot={
          canManageUsers ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Novo usuario
          </Button>
          ) : null
        }
      />
      {meta && (
        <p className="text-xs text-muted-foreground">
          {meta.total} usuario(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
        </p>
      )}

      <UserFilters
        search={search}
        role={role}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <ErrorState message="Nao foi possivel carregar os usuarios." />
      )}

      {!isLoading && data && users.length === 0 && (
        <EmptyState title="Nenhum usuario encontrado" description="Ajuste os filtros ou cadastre um novo usuario." />
      )}

      {!isLoading && data && users.length > 0 && (
        <>
          <UserList
            users={users}
            busy={listBusy}
            onEdit={(user) => {
              setEditId(user.id)
              setEditOpen(true)
            }}
            onToggleStatus={(user) => {
              setToggleTarget(user)
              setToggleOpen(true)
            }}
          />
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                {page} / {meta.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Proxima
              </Button>
            </div>
          )}
        </>
      )}

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditUserDialog
        userId={editId}
        open={editOpen}
        onOpenChange={(next) => {
          setEditOpen(next)
          if (!next) setEditId(null)
        }}
      />
      <ToggleUserStatusDialog
        user={toggleTarget}
        open={toggleOpen}
        onOpenChange={(next) => {
          setToggleOpen(next)
          if (!next) setToggleTarget(null)
        }}
      />
    </div>
  )
}
