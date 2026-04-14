export type BillStatus = 'OPEN' | 'CLOSED' | 'PAID' | 'CANCELLED'

export type BillServiceFeeOption = 'APPLIED' | 'WAIVED'

export type PaymentMethod = 'PIX' | 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'

export interface BillTableRef {
  id: string
  number: string
}

export interface BillListItem {
  id: string
  status: BillStatus
  subtotal: number
  serviceFee: number
  serviceFeeOption: BillServiceFeeOption
  serviceFeePercent: number
  discount: number
  total: number
  paymentMethod: PaymentMethod | null
  openedAt: string
  closedAt: string | null
  paidAt: string | null
  table: BillTableRef
}

export interface BillOrderItem {
  id: string
  productId: string
  name: string
  imageUrl: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string | null
}

export interface BillOrderSummary {
  id: string
  status: OrderStatus
  customerName: string | null
  total: number
  createdAt: string
  items: BillOrderItem[]
}

export interface BillDetail extends BillListItem {
  notes: string | null
  orders: BillOrderSummary[]
}

export interface BillsListResult {
  items: BillListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface BillFilters {
  page?: number
  limit?: number
  status?: BillStatus
  tableId?: string
  dateFrom?: string
  dateTo?: string
}

export interface CloseBillPayload {
  serviceFeeOption?: BillServiceFeeOption
  discount?: number
  notes?: string
}

export interface PayBillPayload {
  paymentMethod: PaymentMethod
  notes?: string
}
