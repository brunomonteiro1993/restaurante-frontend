import type { KitchenOrder } from '@/features/kitchen/types/kitchen.types'
import { KitchenOrderCard } from '@/features/kitchen/components/KitchenOrderCard'

interface KitchenOrderListProps {
  orders: KitchenOrder[]
  onStart: (orderId: string) => void
  onReady: (orderId: string) => void
  pendingOrderId?: string
}

export function KitchenOrderList({ orders, onStart, onReady, pendingOrderId }: KitchenOrderListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {orders.map((order) => (
        <KitchenOrderCard
          key={order.id}
          order={order}
          onStart={onStart}
          onReady={onReady}
          isPendingAction={pendingOrderId === order.id}
        />
      ))}
    </div>
  )
}
