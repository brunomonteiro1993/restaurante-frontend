import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { KitchenOrderList } from '@/features/kitchen/components/KitchenOrderList'
import { useKitchenOrders } from '@/features/kitchen/hooks/useKitchenOrders'
import { useKitchenRealtime } from '@/features/kitchen/hooks/useKitchenRealtime'
import { useReadyOrder } from '@/features/kitchen/hooks/useReadyOrder'
import { useStartOrder } from '@/features/kitchen/hooks/useStartOrder'

export function KitchenPage() {
  useKitchenRealtime()
  const { data, isLoading, isError } = useKitchenOrders()
  const startOrderMutation = useStartOrder()
  const readyOrderMutation = useReadyOrder()

  const pendingOrderId =
    (startOrderMutation.variables as string | undefined) ??
    (readyOrderMutation.variables as string | undefined)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kitchen</h1>
        <p className="text-sm text-muted-foreground">
          Fila operacional da cozinha com pedidos pendentes e em preparo.
        </p>
      </div>

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
            Nao foi possivel carregar os pedidos da cozinha.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && data.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nenhum pedido ativo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nao ha pedidos pendentes ou em preparo no momento.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && data.length > 0 && (
        <KitchenOrderList
          orders={data}
          onStart={(orderId) => startOrderMutation.mutate(orderId)}
          onReady={(orderId) => readyOrderMutation.mutate(orderId)}
          pendingOrderId={pendingOrderId}
        />
      )}
    </div>
  )
}
