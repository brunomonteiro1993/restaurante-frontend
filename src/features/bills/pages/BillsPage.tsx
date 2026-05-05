import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState, LoadingCards } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { BillDetailsDialog } from '@/features/bills/components/BillDetailsDialog'
import { BillFilters } from '@/features/bills/components/BillFilters'
import { BillList } from '@/features/bills/components/BillList'
import { CloseBillDialog } from '@/features/bills/components/CloseBillDialog'
import { PayBillDialog } from '@/features/bills/components/PayBillDialog'
import { useBills } from '@/features/bills/hooks/useBills'
import { useCloseBill } from '@/features/bills/hooks/useCloseBill'
import { usePayBill } from '@/features/bills/hooks/usePayBill'
import type { BillFilters as BillApiFilters, BillListItem, BillStatus } from '@/features/bills/types/bills.types'

type StatusFilter = 'ALL' | BillStatus

export function BillsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [tableId, setTableId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const [detailsBill, setDetailsBill] = useState<BillListItem | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [closeBill, setCloseBill] = useState<BillListItem | null>(null)
  const [closeOpen, setCloseOpen] = useState(false)
  const [payBill, setPayBill] = useState<BillListItem | null>(null)
  const [payOpen, setPayOpen] = useState(false)

  const apiFilters: BillApiFilters = useMemo(
    () => ({
      page,
      limit: 20,
      ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      ...(tableId.trim() ? { tableId: tableId.trim() } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [page, statusFilter, tableId, dateFrom, dateTo],
  )

  useEffect(() => {
    setPage(1)
  }, [statusFilter, tableId, dateFrom, dateTo])

  const { data, isLoading, isError } = useBills(apiFilters)
  const closeMutation = useCloseBill()
  const payMutation = usePayBill()

  const bills = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fechamento de conta"
        subtitle="Listagem, detalhes e acoes de fechamento e pagamento conforme o backend."
      />
      {meta && (
        <p className="text-xs text-muted-foreground">
          {meta.total} conta(s) - pagina {meta.page} de {Math.max(meta.totalPages, 1)}
        </p>
      )}

      <BillFilters
        status={statusFilter}
        tableId={tableId}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onStatusChange={setStatusFilter}
        onTableIdChange={setTableId}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {isLoading && <LoadingCards />}

      {isError && <ErrorState message="Nao foi possivel carregar as contas." />}

      {!isLoading && data && bills.length === 0 && (
        <EmptyState title="Nenhuma conta encontrada" description="Nao ha contas para os filtros selecionados." />
      )}

      {!isLoading && data && bills.length > 0 && (
        <>
          <BillList
            bills={bills}
            pendingCloseId={closeMutation.isPending ? closeMutation.variables?.id : undefined}
            pendingPayId={payMutation.isPending ? payMutation.variables?.id : undefined}
            onDetails={(b) => {
              setDetailsBill(b)
              setDetailsOpen(true)
            }}
            onClose={(b) => {
              setCloseBill(b)
              setCloseOpen(true)
            }}
            onPay={(b) => {
              setPayBill(b)
              setPayOpen(true)
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

      <BillDetailsDialog bill={detailsBill} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <CloseBillDialog bill={closeBill} open={closeOpen} onOpenChange={setCloseOpen} />
      <PayBillDialog bill={payBill} open={payOpen} onOpenChange={setPayOpen} />
    </div>
  )
}
