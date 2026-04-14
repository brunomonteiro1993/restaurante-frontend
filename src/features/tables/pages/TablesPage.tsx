import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateTableDialog } from '@/features/tables/components/CreateTableDialog'
import { DeleteTableDialog } from '@/features/tables/components/DeleteTableDialog'
import { EditTableDialog } from '@/features/tables/components/EditTableDialog'
import { TableFilters } from '@/features/tables/components/TableFilters'
import { TableList } from '@/features/tables/components/TableList'
import { useDeleteTable } from '@/features/tables/hooks/useDeleteTable'
import { useTables } from '@/features/tables/hooks/useTables'
import type { Table, TableListFilters, TableStatusFilter } from '@/features/tables/types/tables.types'

export function TablesPage() {
  const [statusFilter, setStatusFilter] = useState<TableStatusFilter>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Table | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const listFilters: TableListFilters = useMemo(
    () => ({
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      status: statusFilter,
    }),
    [page, limit, search, statusFilter],
  )

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  const { data, isLoading, isError } = useTables(listFilters)
  const deleteMutation = useDeleteTable()

  const tables = data?.items ?? []
  const meta = data?.meta

  const listBusy = deleteMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mesas</h1>
          <p className="text-sm text-muted-foreground">
            Gestao de mesas (CRUD) conforme o backend. Requer permissao de gerenciamento.
          </p>
          {meta && (
            <p className="mt-1 text-xs text-muted-foreground">
              {meta.total} mesa(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
            </p>
          )}
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          Nova mesa
        </Button>
      </div>

      <TableFilters status={statusFilter} search={search} onStatusChange={setStatusFilter} onSearchChange={setSearch} />

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">
            Nao foi possivel carregar as mesas.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && tables.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nenhuma mesa encontrada</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ajuste a busca ou crie uma nova mesa.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && tables.length > 0 && (
        <>
          <TableList
            tables={tables}
            busy={listBusy}
            onEdit={(t) => {
              setEditId(t.id)
              setEditOpen(true)
            }}
            onDelete={(t) => {
              setDeleteTarget(t)
              setDeleteOpen(true)
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

      <CreateTableDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditTableDialog
        tableId={editId}
        open={editOpen}
        onOpenChange={(next) => {
          setEditOpen(next)
          if (!next) setEditId(null)
        }}
      />
      <DeleteTableDialog
        table={deleteTarget}
        open={deleteOpen}
        onOpenChange={(next) => {
          setDeleteOpen(next)
          if (!next) setDeleteTarget(null)
        }}
      />
    </div>
  )
}
