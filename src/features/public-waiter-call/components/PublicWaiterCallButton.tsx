import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PublicWaiterCallStatus } from '@/features/public-waiter-call/components/PublicWaiterCallStatus'
import { useCreatePublicWaiterCall } from '@/features/public-waiter-call/hooks/useCreatePublicWaiterCall'
import { usePublicWaiterCallStatus } from '@/features/public-waiter-call/hooks/usePublicWaiterCallStatus'

interface PublicWaiterCallButtonProps {
  restaurantSlug: string
  tableCode: string
}

export function PublicWaiterCallButton({ restaurantSlug, tableCode }: PublicWaiterCallButtonProps) {
  const statusQuery = usePublicWaiterCallStatus(restaurantSlug, tableCode)
  const createMutation = useCreatePublicWaiterCall(restaurantSlug, tableCode)

  const hasOpenCall = statusQuery.data?.hasOpenCall ?? false

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Precisa de ajuda?</p>
          <PublicWaiterCallStatus statusData={statusQuery.data} />
        </div>
        <Button
          type="button"
          size="sm"
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
