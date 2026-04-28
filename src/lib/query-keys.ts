import type { BillFilters } from '@/features/bills/types/bills.types'
import type { CategoryListFilters } from '@/features/categories/types/categories.types'
import type { OrderFilters } from '@/features/orders/types/orders.types'
import type { ProductListFilters } from '@/features/products/types/products.types'
import type { TableListFilters } from '@/features/tables/types/tables.types'
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
  orders: {
    list: (filters: OrderFilters) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  tables: {
    list: (filters: TableListFilters) => ['tables', 'list', filters] as const,
    detail: (id: string) => ['tables', 'detail', id] as const,
  },
  categories: {
    list: (filters: CategoryListFilters) => ['categories', 'list', filters] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  products: {
    list: (filters: ProductListFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
} as const
