export interface PublicOrderItemPayload {
  productId: string
  quantity: number
  notes?: string
}

export interface CreatePublicOrderPayload {
  restaurantSlug: string
  tableCode: string
  customerName?: string
  notes?: string
  items: PublicOrderItemPayload[]
}

export interface PublicOrderCreatedItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string | null
}

export interface PublicOrderResponse {
  id: string
  status: string
  customerName: string | null
  notes: string | null
  total: number
  table: {
    id: string
    number: string
  }
  items: PublicOrderCreatedItem[]
  createdAt: string
}
