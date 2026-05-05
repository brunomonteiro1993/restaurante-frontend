import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState, LoadingCards } from '@/components/shared/states'
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
  const calls = data?.items ?? []

  return (
    <div className="space-y-4">
      <PageHeader title="Waiter Calls" subtitle="Controle operacional dos chamados de atendimento por mesa." />
      {data?.meta && (
        <p className="text-xs text-muted-foreground">
          {data.meta.total} chamado(s) - pagina {data.meta.page} de {Math.max(data.meta.totalPages, 1)}
        </p>
      )}

      <WaiterCallFilters value={filter} onChange={setFilter} />

      {isLoading && <LoadingCards />}

      {isError && <ErrorState message="Nao foi possivel carregar os chamados." />}

      {!isLoading && data && calls.length === 0 && (
        <EmptyState title="Nenhum chamado encontrado" description="Nao existem chamados para o filtro selecionado." />
      )}

      {!isLoading && data && calls.length > 0 && (
        <WaiterCallList
          calls={calls}
          pendingId={pendingId}
          onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
        />
      )}
    </div>
  )
}
