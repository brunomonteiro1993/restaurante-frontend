import { useMemo, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { WaiterCallFilters } from '@/features/waiter-calls/components/WaiterCallFilters'
import { WaiterCallList } from '@/features/waiter-calls/components/WaiterCallList'
import { useUpdateWaiterCallStatus } from '@/features/waiter-calls/hooks/useUpdateWaiterCallStatus'
import { useWaiterCalls } from '@/features/waiter-calls/hooks/useWaiterCalls'
import type { WaiterCallStatus } from '@/features/waiter-calls/types/waiter-calls.types'

type FilterOption = 'ALL' | WaiterCallStatus

export function WaiterCallsPage() {
  const [filter, setFilter] = useState<FilterOption>('ALL')
  const filters = useMemo(() => (filter === 'ALL' ? {} : { status: filter }), [filter])

  const { data, isLoading, isError } = useWaiterCalls(filters)
  const updateStatusMutation = useUpdateWaiterCallStatus()

  const pendingId = updateStatusMutation.variables?.id

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Waiter Calls</h1>
        <p className="text-sm text-muted-foreground">
          Controle operacional dos chamados de atendimento por mesa.
        </p>
      </div>

      <WaiterCallFilters value={filter} onChange={setFilter} />

      {isLoading && (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">
            Nao foi possivel carregar os chamados.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && data.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nenhum chamado encontrado</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nao existem chamados para o filtro selecionado.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && data.length > 0 && (
        <WaiterCallList
          calls={data}
          pendingId={pendingId}
          onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
        />
      )}
    </div>
  )
}
