import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePermission } from '@/features/auth/permissions/usePermission'
import { BillStatusBadge } from '@/features/bills/components/BillStatusBadge'
import type { BillListItem } from '@/features/bills/types/bills.types'
import { formatCurrency, formatDateTime } from '@/utils/format'

interface BillCardProps {
  bill: BillListItem
  onDetails: () => void
  onClose: () => void
  onPay: () => void
  closePending: boolean
  payPending: boolean
}

export function BillCard({ bill, onDetails, onClose, onPay, closePending, payPending }: BillCardProps) {
  const { can } = usePermission()
  const canClose = can('bills.close')
  const canPay = can('bills.pay')

  const dateLabel =
    bill.status === 'PAID' && bill.paidAt
      ? `Pago em ${formatDateTime(bill.paidAt)}`
      : bill.status === 'CLOSED' && bill.closedAt
        ? `Fechada em ${formatDateTime(bill.closedAt)}`
        : `Aberta em ${formatDateTime(bill.openedAt)}`

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Mesa {bill.table.number}</CardTitle>
          <BillStatusBadge status={bill.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          {/* <span className="font-mono text-[11px]">ID: {bill.id}</span> */}
          <span>{dateLabel}</span>
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <span>Subtotal {formatCurrency(bill.subtotal)}</span>
            <span className="font-medium text-foreground">Total {formatCurrency(bill.total)}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onDetails}>
            Detalhes
          </Button>
          {bill.status === 'OPEN' && canClose && (
            <Button size="sm" disabled={closePending} onClick={onClose}>
              {closePending ? 'Fechando...' : 'Fechar conta'}
            </Button>
          )}
          {bill.status === 'CLOSED' && canPay && (
            <Button size="sm" disabled={payPending} onClick={onPay}>
              {payPending ? 'Registrando...' : 'Registrar pagamento'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
