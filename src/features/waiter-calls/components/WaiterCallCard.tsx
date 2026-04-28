import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePermission } from '@/features/auth/permissions/usePermission'
import { WaiterCallStatusBadge } from '@/features/waiter-calls/components/WaiterCallStatusBadge'
import type {
  WaiterCallListItem,
  WaiterCallStatus,
} from '@/features/waiter-calls/types/waiter-calls.types'
import { formatDateTime } from '@/utils/format'

interface WaiterCallCardProps {
  call: WaiterCallListItem
  onUpdateStatus: (id: string, status: WaiterCallStatus) => void
  isUpdating: boolean
}

export function WaiterCallCard({ call, onUpdateStatus, isUpdating }: WaiterCallCardProps) {
  const { can } = usePermission()
  const canUpdateStatus = can('waiterCalls.updateStatus')

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Mesa {call.table.number}</CardTitle>
          <WaiterCallStatusBadge status={call.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          <span className="font-mono text-[11px]">ID: {call.id}</span>
          <span>Criado: {formatDateTime(call.createdAt)}</span>
          <span>Atualizado: {formatDateTime(call.updatedAt)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {canUpdateStatus && call.status === 'OPEN' && (
            <>
              <Button
                size="sm"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(call.id, 'ANSWERED')}
              >
                {isUpdating ? 'Atualizando...' : 'Atender'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(call.id, 'CLOSED')}
              >
                Fechar
              </Button>
            </>
          )}
          {canUpdateStatus && call.status === 'ANSWERED' && (
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(call.id, 'CLOSED')}
            >
              {isUpdating ? 'Atualizando...' : 'Fechar'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
