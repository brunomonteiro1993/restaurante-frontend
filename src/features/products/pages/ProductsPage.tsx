import { useEffect, useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'

import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermission } from '@/features/auth/permissions/usePermission'
import { CreateProductDialog } from '@/features/products/components/CreateProductDialog'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { EditProductDialog } from '@/features/products/components/EditProductDialog'
import { ProductFilters } from '@/features/products/components/ProductFilters'
import { ProductList } from '@/features/products/components/ProductList'
import { useDeleteProduct } from '@/features/products/hooks/useDeleteProduct'
import { useProductCategoryOptions } from '@/features/products/hooks/useProductCategoryOptions'
import { useProducts } from '@/features/products/hooks/useProducts'
import { productsService } from '@/features/products/services/products.service'
import type {
  ProductAvailabilityFilter,
  ProductListFilters,
  ProductListItem,
} from '@/features/products/types/products.types'

export function ProductsPage() {
  const { can } = usePermission()
  const canManageProducts = can('products.manage')
  const [availabilityFilter, setAvailabilityFilter] =
    useState<ProductAvailabilityFilter>('ALL')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const filters: ProductListFilters = useMemo(
    () => ({
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(categoryId ? { categoryId } : {}),
      availabilityFilter,
      ...(availabilityFilter === 'ALL'
        ? {}
        : { isAvailable: availabilityFilter === 'AVAILABLE' }),
    }),
    [page, limit, search, categoryId, availabilityFilter],
  )

  useEffect(() => {
    setPage(1)
  }, [search, categoryId, availabilityFilter])

  const { data, isLoading, isError } = useProducts(filters)
  const { data: categoryOptions = [], isLoading: categoriesLoading } = useProductCategoryOptions()
  const deleteMutation = useDeleteProduct()

  const products = data?.items ?? []
  const meta = data?.meta
  const listBusy = deleteMutation.isPending

  const detailsQueries = useQueries({
    queries: products.map((product) => ({
      queryKey: ['products', 'detail', product.id],
      queryFn: () => productsService.getById(product.id),
      staleTime: 60_000,
    })),
  })

  const productsWithImages = products.map((product, idx) => ({
    ...product,
    imageUrl: detailsQueries[idx]?.data?.imageUrl ?? null,
  }))

  return (
    <div className="space-y-4">
      <PageHeader
        title="Produtos"
        subtitle="Gestao operacional de produtos do cardapio."
        rightSlot={
          canManageProducts ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Novo produto
          </Button>
          ) : null
        }
      />
      {meta && (
        <p className="text-xs text-muted-foreground">
          {meta.total} produto(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
        </p>
      )}

      <ProductFilters
        availabilityFilter={availabilityFilter}
        search={search}
        categoryId={categoryId}
        categoryOptions={categoryOptions}
        categoriesLoading={categoriesLoading}
        onAvailabilityFilterChange={setAvailabilityFilter}
        onSearchChange={setSearch}
        onCategoryIdChange={setCategoryId}
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
                <Skeleton className="h-9 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <ErrorState message="Nao foi possivel carregar os produtos." />
      )}

      {!isLoading && data && products.length === 0 && (
        <EmptyState title="Nenhum produto encontrado" description="Ajuste os filtros ou cadastre um novo produto." />
      )}

      {!isLoading && data && products.length > 0 && (
        <>
          <ProductList
            products={productsWithImages}
            busy={listBusy}
            onEdit={(product) => {
              setEditId(product.id)
              setEditOpen(true)
            }}
            onDelete={(product) => {
              setDeleteTarget(product)
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

      <CreateProductDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditProductDialog
        productId={editId}
        open={editOpen}
        onOpenChange={(next) => {
          setEditOpen(next)
          if (!next) setEditId(null)
        }}
      />
      <DeleteProductDialog
        product={deleteTarget}
        open={deleteOpen}
        onOpenChange={(next) => {
          setDeleteOpen(next)
          if (!next) setDeleteTarget(null)
        }}
      />
    </div>
  )
}
