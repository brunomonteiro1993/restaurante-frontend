import { api } from '@/services/api'
import type { ApiPaginatedResponse } from '@/types/api.types'
import type { DashboardStats, OrderStatus, TableStatus } from '@/features/dashboard/types/dashboard.types'

interface MinimalTable {
  id: string
  status: TableStatus
}

const countOrdersByStatus = async (status: OrderStatus) => {
  const { data } = await api.get<ApiPaginatedResponse<{ id: string }>>('/orders', {
    params: { status, page: 1, limit: 1 },
  })
  return data.meta.total
}

const countOpenWaiterCalls = async () => {
  const { data } = await api.get<ApiPaginatedResponse<{ id: string }>>('/waiter-calls', {
    params: { onlyOpen: true, page: 1, limit: 1 },
  })
  return data.meta.total
}

const listAllTables = async (): Promise<MinimalTable[]> => {
  const firstPage = await api.get<ApiPaginatedResponse<MinimalTable>>('/tables', {
    params: { page: 1, limit: 100 },
  })

  const items = [...firstPage.data.data]
  const totalPages = firstPage.data.meta.totalPages

  if (totalPages <= 1) return items

  const pages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      api.get<ApiPaginatedResponse<MinimalTable>>('/tables', {
        params: { page: index + 2, limit: 100 },
      }),
    ),
  )

  pages.forEach((page) => items.push(...page.data.data))
  return items
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [pendingOrders, preparingOrders, readyOrders, openWaiterCalls, tables] = await Promise.all([
      countOrdersByStatus('PENDING'),
      countOrdersByStatus('PREPARING'),
      countOrdersByStatus('READY'),
      countOpenWaiterCalls(),
      listAllTables(),
    ])

    const tablesInUse = tables.filter(
      (table) => table.status === 'OCCUPIED' || table.status === 'RESERVED',
    ).length

    return {
      pendingOrders,
      preparingOrders,
      readyOrders,
      openWaiterCalls,
      tablesInUse,
    }
  },
}
