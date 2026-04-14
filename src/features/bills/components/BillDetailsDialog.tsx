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
import { BillStatusBadge } from '@/features/bills/components/BillStatusBadge'
import { useBillDetails } from '@/features/bills/hooks/useBillDetails'
import type { BillListItem, PaymentMethod } from '@/features/bills/types/bills.types'
import { formatCurrency, formatDateTime } from '@/utils/format'

const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartao de credito',
  DEBIT_CARD: 'Cartao de debito',
}

const serviceFeeOptionLabels = {
  APPLIED: 'Taxa de servico aplicada (10%)',
  WAIVED: 'Taxa de servico isenta',
} as const

interface BillDetailsDialogProps {
  bill: BillListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BillDetailsDialog({ bill, open, onOpenChange }: BillDetailsDialogProps) {
  const { detail, isLoading, isError, mismatch } = useBillDetails(bill, open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {bill && (
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Conta - Mesa {bill.table.number}</DialogTitle>
            <DialogDescription>Valores e pedidos conforme retorno do backend.</DialogDescription>
          </DialogHeader>

          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {!isLoading && detail && (
            <div className="space-y-4 text-sm">
              {isError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                  Nao foi possivel carregar a conta atual da mesa para exibir os pedidos. Valores abaixo
                  refletem a listagem.
                </p>
              )}
              {mismatch && (
                <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                  A mesa possui outra conta ativa no momento. Exibindo dados desta linha da lista (sem
                  pedidos detalhados).
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">ID {detail.id}</span>
                <BillStatusBadge status={detail.status} />
              </div>

              <dl className="grid gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{formatCurrency(detail.subtotal)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Taxa de servico</dt>
                  <dd className="font-medium">
                    {formatCurrency(detail.serviceFee)} ({detail.serviceFeePercent}% -{' '}
                    {serviceFeeOptionLabels[detail.serviceFeeOption]})
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Desconto</dt>
                  <dd className="font-medium">{formatCurrency(detail.discount)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-medium text-base">{formatCurrency(detail.total)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Forma de pagamento</dt>
                  <dd className="font-medium">
                    {detail.paymentMethod ? paymentMethodLabels[detail.paymentMethod] : '-'}
                  </dd>
                </div>
                {detail.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Observacoes</dt>
                    <dd>{detail.notes}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Aberta em</dt>
                  <dd>{formatDateTime(detail.openedAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fechada em</dt>
                  <dd>{detail.closedAt ? formatDateTime(detail.closedAt) : '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Paga em</dt>
                  <dd>{detail.paidAt ? formatDateTime(detail.paidAt) : '-'}</dd>
                </div>
              </dl>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pedidos
                </h4>
                {detail.orders.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Nenhum pedido retornado para esta visualizacao (conta paga/cancelada ou endpoint
                    indisponivel para este registro).
                  </p>
                ) : (
                  <ul className="space-y-3 border-t pt-3">
                    {detail.orders.map((order) => (
                      <li key={order.id} className="rounded-md border bg-muted/30 p-2 text-xs">
                        <div className="flex flex-wrap justify-between gap-2 font-medium">
                          <span>Pedido #{order.id.slice(0, 8)}</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                        <p className="text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                        <ul className="mt-2 space-y-1 border-t border-border/60 pt-2">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between gap-2">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>{formatCurrency(item.totalPrice)}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
