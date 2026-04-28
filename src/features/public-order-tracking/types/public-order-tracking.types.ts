import type { PublicOrderCreatedItem } from '@/features/public-order/types/public-order.types'

export type PublicTrackableOrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'

export interface PublicLastOrderSnapshot {
  orderId: string
  createdAt: string
  status: PublicTrackableOrderStatus
  restaurantSlug: string
  tableCode: string
}

export interface PublicOrderTrackingResult {
  id: string
  status: PublicTrackableOrderStatus
  customerName: string | null
  notes: string | null
  total: number
  createdAt: string
  updatedAt: string
  table: {
    number: string
  }
  items: Array<Pick<PublicOrderCreatedItem, 'name' | 'quantity' | 'notes'>>
}
