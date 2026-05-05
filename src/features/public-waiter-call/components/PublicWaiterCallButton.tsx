import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PublicWaiterCallStatus } from '@/features/public-waiter-call/components/PublicWaiterCallStatus'
import { useCreatePublicWaiterCall } from '@/features/public-waiter-call/hooks/useCreatePublicWaiterCall'
import { usePublicWaiterCallRealtime } from '@/features/public-waiter-call/hooks/usePublicWaiterCallRealtime'
import { usePublicWaiterCallStatus } from '@/features/public-waiter-call/hooks/usePublicWaiterCallStatus'

interface PublicWaiterCallButtonProps {
  restaurantSlug: string
  tableCode: string
}

export function PublicWaiterCallButton({ restaurantSlug, tableCode }: PublicWaiterCallButtonProps) {
  usePublicWaiterCallRealtime(restaurantSlug, tableCode)
  const statusQuery = usePublicWaiterCallStatus(restaurantSlug, tableCode)
  const createMutation = useCreatePublicWaiterCall(restaurantSlug, tableCode)

  const hasOpenCall = statusQuery.data?.hasOpenCall ?? false

  return (
    <Card className="rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-3 p-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Precisa de ajuda?</p>
          <PublicWaiterCallStatus statusData={statusQuery.data} />
        </div>
        <Button
          type="button"
          size="sm"
          className="transition-all duration-200"
          disabled={statusQuery.isLoading || hasOpenCall || createMutation.isPending}
          onClick={() =>
            createMutation.mutate({
              restaurantSlug,
              tableCode,
            })
          }
        >
          {createMutation.isPending
            ? 'Chamando...'
            : hasOpenCall
              ? 'Garcom chamado'
              : 'Chamar garcom'}
        </Button>
      </CardContent>
    </Card>
  )
}
