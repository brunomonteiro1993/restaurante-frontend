export type UserRole = 'ADMIN' | 'MANAGER' | 'WAITER' | 'KITCHEN'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'

export type WaiterCallStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'
export type TableStatus = 'FREE' | 'OCCUPIED' | 'RESERVED' | 'CLOSED'
export type BillStatus = 'OPEN' | 'PAID' | 'CANCELLED'
export type PaymentMethod = 'CASH' | 'CARD' | 'PIX'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  restaurantId: string
}

export interface AuthUser extends User {
  token: string
}
