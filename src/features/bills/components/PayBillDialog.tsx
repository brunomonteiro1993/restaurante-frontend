import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePayBill } from '@/features/bills/hooks/usePayBill'
import type { BillListItem, PaymentMethod } from '@/features/bills/types/bills.types'
import { formatCurrency } from '@/utils/format'

interface PayBillDialogProps {
  bill: BillListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const methods: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'PIX' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'CREDIT_CARD', label: 'Cartao de credito' },
  { value: 'DEBIT_CARD', label: 'Cartao de debito' },
]

export function PayBillDialog({ bill, open, onOpenChange }: PayBillDialogProps) {
  const payMutation = usePayBill()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX')
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setPaymentMethod('PIX')
    setNotes('')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bill) return

    payMutation.mutate(
      {
        id: bill.id,
        tableId: bill.table.id,
        payload: {
          paymentMethod,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        },
      },
      {
        onSuccess: () => handleOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {bill && (
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Registrar pagamento</DialogTitle>
              <DialogDescription>
                Mesa {bill.table.number}. Total {formatCurrency(bill.total)} (referencia da lista).
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Forma de pagamento</p>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  {methods.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Observacoes</p>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={payMutation.isPending}>
                {payMutation.isPending ? 'Registrando...' : 'Confirmar pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
