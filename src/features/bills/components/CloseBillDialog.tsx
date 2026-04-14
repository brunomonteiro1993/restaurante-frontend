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
import { useCloseBill } from '@/features/bills/hooks/useCloseBill'
import type { BillListItem, BillServiceFeeOption } from '@/features/bills/types/bills.types'

interface CloseBillDialogProps {
  bill: BillListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloseBillDialog({ bill, open, onOpenChange }: CloseBillDialogProps) {
  const closeMutation = useCloseBill()
  const [serviceFeeOption, setServiceFeeOption] = useState<string>('')
  const [discount, setDiscount] = useState('')
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setServiceFeeOption('')
    setDiscount('')
    setNotes('')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bill) return

    const payload: {
      serviceFeeOption?: BillServiceFeeOption
      discount?: number
      notes?: string
    } = {}

    if (serviceFeeOption === 'APPLIED' || serviceFeeOption === 'WAIVED') {
      payload.serviceFeeOption = serviceFeeOption
    }

    if (discount.trim() !== '') {
      const n = Number(discount.replace(',', '.'))
      if (!Number.isFinite(n) || n < 0) return
      payload.discount = n
    }

    if (notes.trim() !== '') {
      payload.notes = notes.trim()
    }

    closeMutation.mutate(
      { id: bill.id, tableId: bill.table.id, payload },
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
              <DialogTitle>Fechar conta</DialogTitle>
              <DialogDescription>
                Mesa {bill.table.number}. Opcional: ajustar taxa de servico, desconto e observacoes.
                Pedidos pendentes ou em preparo impedem o fechamento no backend.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Taxa de servico</p>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                  value={serviceFeeOption}
                  onChange={(e) => setServiceFeeOption(e.target.value)}
                >
                  <option value="">Manter padrao da conta</option>
                  <option value="APPLIED">Aplicar 10%</option>
                  <option value="WAIVED">Isentar</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Desconto (R$)</p>
                <Input
                  inputMode="decimal"
                  placeholder="0,00"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
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
              <Button type="submit" disabled={closeMutation.isPending}>
                {closeMutation.isPending ? 'Fechando...' : 'Confirmar fechamento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
