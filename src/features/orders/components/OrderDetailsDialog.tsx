import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderActionButtons } from '@/features/orders/components/OrderActionButtons'
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge'
import { useOrderDetails } from '@/features/orders/hooks/useOrderDetails'
import { formatCurrency, formatDateTime } from '@/utils/format'

interface OrderDetailsDialogProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ orderId, open, onOpenChange }: OrderDetailsDialogProps) {
  const { data, isLoading, isError, refetch } = useOrderDetails(orderId, open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalhes do pedido</DialogTitle>
          <DialogDescription>Itens e valores conforme o backend.</DialogDescription>
        </DialogHeader>

        {!orderId && <p className="text-sm text-muted-foreground">Nenhum pedido selecionado.</p>}

        {orderId && isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {orderId && isError && (
          <p className="text-sm text-destructive">
            Nao foi possivel carregar o pedido.{' '}
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </p>
        )}

        {orderId && data && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-muted-foreground">{data.id}</span>
              <OrderStatusBadge status={data.status} />
            </div>

            <dl className="grid gap-2 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Mesa</dt>
                <dd className="font-medium">{data.table.number}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium">{data.customerName ?? '-'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Observacoes do pedido</dt>
                <dd>{data.notes ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Total</dt>
                <dd className="font-medium text-base">{formatCurrency(data.total)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Criado em</dt>
                <dd>{formatDateTime(data.createdAt)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Atualizado em</dt>
                <dd>{formatDateTime(data.updatedAt)}</dd>
              </div>
            </dl>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Itens
              </h4>
              <ul className="space-y-2 border-t pt-3">
                {data.items.map((item) => (
                  <li key={item.id} className="rounded-md border bg-muted/30 p-2 text-xs">
                    <div className="flex justify-between gap-2 font-medium">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>
                    <p className="text-muted-foreground">
                      Unit. {formatCurrency(item.unitPrice)}
                      {item.notes ? ` · ${item.notes}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Acoes</p>
              <OrderActionButtons orderId={data.id} status={data.status} />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
