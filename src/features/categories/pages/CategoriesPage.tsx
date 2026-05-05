import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermission } from '@/features/auth/permissions/usePermission'
import { CategoryFilters } from '@/features/categories/components/CategoryFilters'
import { CategoryList } from '@/features/categories/components/CategoryList'
import { CreateCategoryDialog } from '@/features/categories/components/CreateCategoryDialog'
import { DeleteCategoryDialog } from '@/features/categories/components/DeleteCategoryDialog'
import { EditCategoryDialog } from '@/features/categories/components/EditCategoryDialog'
import { useDeleteCategory } from '@/features/categories/hooks/useDeleteCategory'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type {
  Category,
  CategoryActiveFilter,
  CategoryListFilters,
} from '@/features/categories/types/categories.types'

export function CategoriesPage() {
  const { can } = usePermission()
  const canManageCategories = can('categories.manage')
  const [activeFilter, setActiveFilter] = useState<CategoryActiveFilter>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const filters: CategoryListFilters = useMemo(
    () => ({
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      activeFilter,
      ...(activeFilter === 'ALL' ? {} : { isActive: activeFilter === 'ACTIVE' }),
    }),
    [page, limit, search, activeFilter],
  )

  useEffect(() => {
    setPage(1)
  }, [search, activeFilter])

  const { data, isLoading, isError } = useCategories(filters)
  const deleteMutation = useDeleteCategory()

  const categories = data?.items ?? []
  const meta = data?.meta
  const listBusy = deleteMutation.isPending

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categorias"
        subtitle="Gestao de categorias do cardapio conforme endpoints internos."
        rightSlot={
          canManageCategories ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Nova categoria
          </Button>
          ) : null
        }
      />
      {meta && (
        <p className="text-xs text-muted-foreground">
          {meta.total} categoria(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
        </p>
      )}

      <CategoryFilters
        activeFilter={activeFilter}
        search={search}
        onActiveFilterChange={setActiveFilter}
        onSearchChange={setSearch}
      />

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
        <ErrorState message="Nao foi possivel carregar as categorias." />
      )}

      {!isLoading && data && categories.length === 0 && (
        <EmptyState
          title="Nenhuma categoria encontrada"
          description="Ajuste a busca/filtro ou crie uma nova categoria."
        />
      )}

      {!isLoading && data && categories.length > 0 && (
        <>
          <CategoryList
            categories={categories}
            busy={listBusy}
            onEdit={(category) => {
              setEditId(category.id)
              setEditOpen(true)
            }}
            onDelete={(category) => {
              setDeleteTarget(category)
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

      <CreateCategoryDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditCategoryDialog
        categoryId={editId}
        open={editOpen}
        onOpenChange={(next) => {
          setEditOpen(next)
          if (!next) setEditId(null)
        }}
      />
      <DeleteCategoryDialog
        category={deleteTarget}
        open={deleteOpen}
        onOpenChange={(next) => {
          setDeleteOpen(next)
          if (!next) setDeleteTarget(null)
        }}
      />
    </div>
  )
}
