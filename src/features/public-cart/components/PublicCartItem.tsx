import { Minus, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { PublicCartItem as CartItem } from '@/features/public-cart/types/public-cart.types'
import { formatCurrency } from '@/utils/format'

interface PublicCartItemProps {
  item: CartItem
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
  onNotesChange: (notes: string) => void
}

export function PublicCartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onNotesChange,
}: PublicCartItemProps) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
        </div>
        <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" size="icon-sm" variant="outline" onClick={onDecrement}>
          <Minus className="size-4" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button type="button" size="icon-sm" variant="outline" onClick={onIncrement}>
          <Plus className="size-4" />
        </Button>
        <span className="ml-auto text-sm font-semibold">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Observacao</label>
        <textarea
          className="min-h-16 w-full rounded-md border border-input bg-transparent px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          placeholder="Ex.: sem cebola, bem passado..."
          value={item.notes ?? ''}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </div>
  )
}
