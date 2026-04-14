import { OrderCard } from '@/features/orders/components/OrderCard'
import type { OrderListItem } from '@/features/orders/types/orders.types'

interface OrderListProps {
  orders: OrderListItem[]
  onDetails: (order: OrderListItem) => void
}

export function OrderList({ orders, onDetails }: OrderListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onDetails={() => onDetails(order)} />
      ))}
    </div>
  )
}
