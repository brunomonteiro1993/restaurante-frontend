import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            Gestao de categorias do cardapio conforme endpoints internos.
          </p>
          {meta && (
            <p className="mt-1 text-xs text-muted-foreground">
              {meta.total} categoria(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
            </p>
          )}
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          Nova categoria
        </Button>
      </div>

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
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">
            Nao foi possivel carregar as categorias.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && categories.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nenhuma categoria encontrada</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ajuste a busca/filtro ou crie uma nova categoria.
          </CardContent>
        </Card>
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
