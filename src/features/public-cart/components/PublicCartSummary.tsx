import { formatCurrency } from '@/utils/format'

interface PublicCartSummaryProps {
  itemsCount: number
  subtotal: number
}

export function PublicCartSummary({ itemsCount, subtotal }: PublicCartSummaryProps) {
  return (
    <div className="space-y-1 rounded-md border bg-muted/30 p-3">
      <div className="flex items-center justify-between text-sm">
        <span>Itens</span>
        <span>{itemsCount}</span>
      </div>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">Valor final sera recalculado no envio do pedido.</p>
    </div>
  )
}
