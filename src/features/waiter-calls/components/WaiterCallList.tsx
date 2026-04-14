import { WaiterCallCard } from '@/features/waiter-calls/components/WaiterCallCard'
import type {
  WaiterCallListItem,
  WaiterCallStatus,
} from '@/features/waiter-calls/types/waiter-calls.types'

interface WaiterCallListProps {
  calls: WaiterCallListItem[]
  onUpdateStatus: (id: string, status: WaiterCallStatus) => void
  pendingId?: string
}

export function WaiterCallList({ calls, onUpdateStatus, pendingId }: WaiterCallListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {calls.map((call) => (
        <WaiterCallCard
          key={call.id}
          call={call}
          onUpdateStatus={onUpdateStatus}
          isUpdating={pendingId === call.id}
        />
      ))}
    </div>
  )
}
