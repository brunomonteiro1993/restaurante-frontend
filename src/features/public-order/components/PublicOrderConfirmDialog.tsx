import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { PublicCartItem } from '@/features/public-cart/types/public-cart.types'
import {
  publicOrderConfirmSchema,
  type PublicOrderConfirmValues,
} from '@/features/public-order/schemas/public-order.schema'
import { formatCurrency } from '@/utils/format'

interface PublicOrderConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: PublicCartItem[]
  subtotal: number
  submitting: boolean
  onConfirm: (values: PublicOrderConfirmValues) => void
}

export function PublicOrderConfirmDialog({
  open,
  onOpenChange,
  items,
  subtotal,
  submitting,
  onConfirm,
}: PublicOrderConfirmDialogProps) {
  const form = useForm<PublicOrderConfirmValues>({
    resolver: zodResolver(publicOrderConfirmSchema),
    defaultValues: {
      customerName: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (!open) form.reset({ customerName: '', notes: '' })
  }, [open, form])

  const handleSubmit = (values: PublicOrderConfirmValues) => {
    if (items.length === 0) return
    onConfirm(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar pedido</DialogTitle>
          <DialogDescription>Revise os itens e confirme o envio para a cozinha.</DialogDescription>
        </DialogHeader>

        <div className="max-h-52 space-y-2 overflow-y-auto rounded-md border p-2">
          {items.map((item) => (
            <div key={item.productId} className="rounded-md border p-2 text-sm">
              <p className="font-medium">
                {item.quantity}x {item.name}
              </p>
              {item.notes?.trim() && <p className="text-xs text-muted-foreground">Obs.: {item.notes}</p>}
            </div>
          ))}
        </div>

        <p className="text-sm font-medium">Subtotal visual: {formatCurrency(subtotal)}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            <FormField
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do cliente (opcional)</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
                      placeholder="Ex.: Allan"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observacao geral (opcional)</FormLabel>
                  <FormControl>
                    <textarea
                      className="min-h-20 w-full rounded-md border border-input bg-transparent px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                      placeholder="Ex.: chamar no balcao, alergia, etc."
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting || items.length === 0}>
                {submitting ? 'Enviando...' : 'Confirmar envio'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
