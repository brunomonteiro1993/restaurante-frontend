import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { PublicCartItem } from '@/features/public-cart/components/PublicCartItem'
import { PublicCartSummary } from '@/features/public-cart/components/PublicCartSummary'
import { usePublicCart } from '@/features/public-cart/hooks/usePublicCart'
import { PublicOrderConfirmDialog } from '@/features/public-order/components/PublicOrderConfirmDialog'
import { PublicOrderSuccessDialog } from '@/features/public-order/components/PublicOrderSuccessDialog'
import { useCreatePublicOrder } from '@/features/public-order/hooks/useCreatePublicOrder'
import type { PublicOrderConfirmValues } from '@/features/public-order/schemas/public-order.schema'
import type { PublicOrderResponse } from '@/features/public-order/types/public-order.types'
import { savePublicLastOrder } from '@/features/public-order-tracking/hooks/usePublicOrderTracking'
import { toast } from 'sonner'

interface PublicCartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantSlug: string
  tableCode: string
}

export function PublicCartDrawer({
  open,
  onOpenChange,
  restaurantSlug,
  tableCode,
}: PublicCartDrawerProps) {
  const { state, itemsCount, subtotal, incrementItem, decrementItem, removeItem, setItemNotes, clear } =
    usePublicCart()
  const createOrderMutation = useCreatePublicOrder()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<PublicOrderResponse | null>(null)

  const handleConfirmOrder = (values: PublicOrderConfirmValues) => {
    if (state.items.length === 0) {
      toast.error('Carrinho vazio.')
      return
    }

    const invalidItem = state.items.find((item) => item.quantity <= 0)
    if (invalidItem) {
      toast.error('Carrinho possui item com quantidade invalida.')
      return
    }

    createOrderMutation.mutate(
      {
        restaurantSlug,
        tableCode,
        customerName: values.customerName?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
        items: state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes?.trim() || undefined,
        })),
      },
      {
        onSuccess: (order) => {
          toast.success('Pedido enviado com sucesso.')
          savePublicLastOrder({
            orderId: order.id,
            createdAt: order.createdAt,
            status:
              order.status === 'PENDING' ||
              order.status === 'PREPARING' ||
              order.status === 'READY' ||
              order.status === 'DELIVERED' ||
              order.status === 'CANCELLED'
                ? order.status
                : 'PENDING',
            restaurantSlug,
            tableCode,
          })
          clear()
          setConfirmOpen(false)
          onOpenChange(false)
          setCreatedOrder(order)
          setSuccessOpen(true)
        },
      },
    )
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] max-w-md rounded-t-2xl border p-0 shadow-xl">
          <SheetHeader className="border-b bg-muted/30">
            <SheetTitle>Seu carrinho</SheetTitle>
            <SheetDescription>Revise os itens antes de enviar o pedido.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Seu carrinho esta vazio.</p>
            ) : (
              state.items.map((item) => (
                <PublicCartItem
                  key={item.productId}
                  item={item}
                  onIncrement={() => incrementItem(item.productId)}
                  onDecrement={() => decrementItem(item.productId)}
                  onRemove={() => removeItem(item.productId)}
                  onNotesChange={(notes) => setItemNotes(item.productId, notes)}
                />
              ))
            )}
          </div>

          <SheetFooter className="border-t bg-background/90 backdrop-blur">
            <PublicCartSummary itemsCount={itemsCount} subtotal={subtotal} />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" disabled={state.items.length === 0} onClick={clear}>
                Limpar
              </Button>
              <Button
                type="button"
                disabled={state.items.length === 0 || createOrderMutation.isPending}
                onClick={() => setConfirmOpen(true)}
              >
                Enviar pedido
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <PublicOrderConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        items={state.items}
        subtotal={subtotal}
        submitting={createOrderMutation.isPending}
        onConfirm={handleConfirmOrder}
      />

      <PublicOrderSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        order={createdOrder}
      />
    </>
  )
}
