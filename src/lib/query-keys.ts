import type { BillFilters } from '@/features/bills/types/bills.types'
import type { WaiterCallFilters } from '@/features/waiter-calls/types/waiter-calls.types'

export const queryKeys = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  kitchen: {
    orders: ['kitchen', 'orders'] as const,
  },
  waiterCalls: {
    list: (filters: WaiterCallFilters) => ['waiter-calls', 'list', filters] as const,
    detail: (id: string) => ['waiter-calls', 'detail', id] as const,
  },
  bills: {
    list: (filters: BillFilters) => ['bills', 'list', filters] as const,
    detail: (id: string) => ['bills', 'detail', id] as const,
    currentTable: (tableId: string) => ['bills', 'current-table', tableId] as const,
  },
} as const
