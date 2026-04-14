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
} as const
