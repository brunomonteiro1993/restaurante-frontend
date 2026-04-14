import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const statusStyles: Record<WaiterCallStatus, { label: string; className: string }> = {
  OPEN: { label: 'Aberto', className: 'bg-amber-100 text-amber-800' },
  ANSWERED: { label: 'Em atendimento', className: 'bg-blue-100 text-blue-800' },
  CLOSED: { label: 'Fechado', className: 'bg-zinc-200 text-zinc-800' },
}

export function WaiterCallCard({ call, onUpdateStatus, isUpdating }: WaiterCallCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Chamado #{call.id.slice(0, 8)}</CardTitle>
          <Badge className={statusStyles[call.status].className}>{statusStyles[call.status].label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          <span>Mesa {call.table.number}</span>
          <span>Criado: {formatDateTime(call.createdAt)}</span>
          <span className="sm:col-span-2">Atualizado: {formatDateTime(call.updatedAt)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {call.status === 'OPEN' && (
            <>
              <Button
                size="sm"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(call.id, 'ANSWERED')}
              >
                {isUpdating ? 'Atualizando...' : 'Marcar como atendido'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(call.id, 'CLOSED')}
              >
                Fechar chamado
              </Button>
            </>
          )}

          {call.status === 'ANSWERED' && (
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(call.id, 'CLOSED')}
            >
              {isUpdating ? 'Atualizando...' : 'Finalizar atendimento'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
