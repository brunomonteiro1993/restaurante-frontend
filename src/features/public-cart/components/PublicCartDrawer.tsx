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

interface PublicCartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PublicCartDrawer({ open, onOpenChange }: PublicCartDrawerProps) {
  const { state, itemsCount, subtotal, incrementItem, decrementItem, removeItem, setItemNotes, clear } =
    usePublicCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] max-w-md p-0">
        <SheetHeader className="border-b">
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

        <SheetFooter className="border-t">
          <PublicCartSummary itemsCount={itemsCount} subtotal={subtotal} />
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" disabled={state.items.length === 0} onClick={clear}>
              Limpar
            </Button>
            <Button type="button" disabled>
              Enviar pedido (proximo passo)
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
