export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'
export type WaiterCallStatus = 'OPEN' | 'ANSWERED' | 'CLOSED'
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED'

export interface DashboardStats {
  pendingOrders: number
  preparingOrders: number
  readyOrders: number
  openWaiterCalls: number
  tablesInUse: number
}
