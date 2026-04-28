import { Badge } from '@/components/ui/badge'
import type { PublicWaiterCallStatusResult } from '@/features/public-waiter-call/types/public-waiter-call.types'

interface PublicWaiterCallStatusProps {
  statusData?: PublicWaiterCallStatusResult
}

export function PublicWaiterCallStatus({ statusData }: PublicWaiterCallStatusProps) {
  if (!statusData?.hasOpenCall) {
    return (
      <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-100">Sem chamado aberto</Badge>
    )
  }

  return (
    <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">Garcom chamado</Badge>
  )
}
