import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PublicOrderResponse } from '@/features/public-order/types/public-order.types'
import { formatCurrency } from '@/utils/format'

interface PublicOrderSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PublicOrderResponse | null
}

export function PublicOrderSuccessDialog({ open, onOpenChange, order }: PublicOrderSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pedido enviado com sucesso</DialogTitle>
          <DialogDescription>Seu pedido foi recebido e ja esta no fluxo da cozinha.</DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-2 rounded-md border p-3 text-sm">
            <p>
              <span className="font-medium">Pedido:</span> #{order.id.slice(0, 8)}
            </p>
            <p>
              <span className="font-medium">Status:</span> {order.status}
            </p>
            <p>
              <span className="font-medium">Mesa:</span> {order.table.number}
            </p>
            <p>
              <span className="font-medium">Total:</span> {formatCurrency(order.total)}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
