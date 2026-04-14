import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { billsService } from '@/features/bills/services/bills.service'
import type { BillDetail, BillListItem } from '@/features/bills/types/bills.types'

function listItemToDetailPreview(item: BillListItem): BillDetail {
  return {
    ...item,
    notes: null,
    orders: [],
  }
}

/**
 * Backend nao expoe GET /bills/:id. Para contas OPEN/CLOSED, tentamos
 * GET /bills/table/:tableId/current e usamos o retorno se o id coincidir.
 * Para PAID/CANCELLED, exibimos apenas os dados da listagem (sem pedidos).
 */
export function useBillDetails(bill: BillListItem | null, open: boolean) {
  const canUseCurrentEndpoint =
    open && !!bill && (bill.status === 'OPEN' || bill.status === 'CLOSED')

  const currentQuery = useQuery({
    queryKey: queryKeys.bills.currentTable(bill?.table.id ?? ''),
    queryFn: () => billsService.getCurrentByTable(bill!.table.id),
    enabled: canUseCurrentEndpoint && !!bill?.table.id,
  })

  if (!bill) {
    return {
      detail: null as BillDetail | null,
      isLoading: false,
      isError: false,
      error: null as Error | null,
      mismatch: false,
      refetch: currentQuery.refetch,
    }
  }

  if (currentQuery.isLoading) {
    return {
      detail: null as BillDetail | null,
      isLoading: true,
      isError: false,
      error: null as Error | null,
      mismatch: false,
      refetch: currentQuery.refetch,
    }
  }

  if (canUseCurrentEndpoint && currentQuery.data?.id === bill.id) {
    return {
      detail: currentQuery.data,
      isLoading: false,
      isError: currentQuery.isError,
      error: (currentQuery.error as Error) ?? null,
      mismatch: false,
      refetch: currentQuery.refetch,
    }
  }

  if (canUseCurrentEndpoint && currentQuery.isError) {
    return {
      detail: listItemToDetailPreview(bill),
      isLoading: false,
      isError: true,
      error: (currentQuery.error as Error) ?? null,
      mismatch: false,
      refetch: currentQuery.refetch,
    }
  }

  if (canUseCurrentEndpoint && currentQuery.isSuccess && currentQuery.data && currentQuery.data.id !== bill.id) {
    return {
      detail: listItemToDetailPreview(bill),
      isLoading: false,
      isError: false,
      error: null as Error | null,
      mismatch: true,
      refetch: currentQuery.refetch,
    }
  }

  return {
    detail: listItemToDetailPreview(bill),
    isLoading: false,
    isError: false,
    error: null as Error | null,
    mismatch: false,
    refetch: currentQuery.refetch,
  }
}
