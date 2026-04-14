export const queryKeys = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  kitchen: {
    orders: ['kitchen', 'orders'] as const,
  },
  waiterCalls: {
    list: (filters: { status?: string }) => ['waiter-calls', 'list', filters] as const,
    detail: (id: string) => ['waiter-calls', 'detail', id] as const,
  },
} as const
