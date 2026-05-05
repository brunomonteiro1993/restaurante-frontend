import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState, LoadingCards } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { OrderDetailsDialog } from '@/features/orders/components/OrderDetailsDialog'
import { OrderFilters } from '@/features/orders/components/OrderFilters'
import { OrderList } from '@/features/orders/components/OrderList'
import { useOrders } from '@/features/orders/hooks/useOrders'
import type { OrderFilters as OrderApiFilters, OrderListItem, OrderStatus } from '@/features/orders/types/orders.types'

type StatusFilter = 'ALL' | OrderStatus

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [tableId, setTableId] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const apiFilters: OrderApiFilters = useMemo(
    () => ({
      page,
      limit: 20,
      ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      ...(tableId.trim() ? { tableId: tableId.trim() } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [page, statusFilter, tableId, search, dateFrom, dateTo],
  )

  useEffect(() => {
    setPage(1)
  }, [statusFilter, tableId, search, dateFrom, dateTo])

  const { data, isLoading, isError } = useOrders(apiFilters)
  const orders = data?.items ?? []
  const meta = data?.meta

  const openDetails = (order: OrderListItem) => {
    setDetailsOrderId(order.id)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pedidos"
        subtitle="Lista operacional com filtros do backend. Acoes de cozinha continuam na Kitchen; aqui o foco e acompanhamento e entrega."
      />
      {meta && (
        <p className="text-xs text-muted-foreground">
          {meta.total} pedido(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
        </p>
      )}

      <OrderFilters
        status={statusFilter}
        tableId={tableId}
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onStatusChange={setStatusFilter}
        onTableIdChange={setTableId}
        onSearchChange={setSearch}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {isLoading && <LoadingCards />}

      {isError && <ErrorState message="Nao foi possivel carregar os pedidos." />}

      {!isLoading && data && orders.length === 0 && (
        <EmptyState title="Nenhum pedido encontrado" description="Ajuste os filtros ou aguarde novos pedidos." />
      )}

      {!isLoading && data && orders.length > 0 && (
        <>
          <OrderList orders={orders} onDetails={openDetails} />
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

      <OrderDetailsDialog
        orderId={detailsOrderId}
        open={detailsOpen}
        onOpenChange={(next) => {
          setDetailsOpen(next)
          if (!next) setDetailsOrderId(null)
        }}
      />
    </div>
  )
}
