export type KitchenOrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'

/** Alinhado ao GET /orders/:id (OrderDetailItem do backend). */
export interface KitchenOrderItem {
  id: string
  productId: string
  name: string
  imageUrl: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string | null
}

export interface KitchenOrder {
  id: string
  status: KitchenOrderStatus
  customerName: string | null
  notes: string | null
  total: number
  createdAt: string
  table: {
    id: string
    number: string
  }
  items: KitchenOrderItem[]
}

export interface KitchenOrderSummary {
  id: string
  status: KitchenOrderStatus
  customerName: string | null
  total: number
  createdAt: string
  table: {
    number: string
  }
  items: Array<{
    name: string
    quantity: number
  }>
}

export interface KitchenOrderActionResult {
  id: string
  status: KitchenOrderStatus
  updatedAt: string
}
