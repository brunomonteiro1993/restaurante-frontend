import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/format'

interface PublicCartButtonProps {
  itemsCount: number
  subtotal: number
  onClick: () => void
}

export function PublicCartButton({ itemsCount, subtotal, onClick }: PublicCartButtonProps) {
  if (itemsCount <= 0) return null

  return (
    <div className="fixed inset-x-0 bottom-3 z-40 mx-auto w-full max-w-md px-4">
      <Button type="button" className="h-12 w-full justify-between shadow-lg" onClick={onClick}>
        <span className="flex items-center gap-2">
          <ShoppingCart className="size-4" />
          Ver carrinho
          <Badge variant="secondary" className="bg-white/20 text-white">
            {itemsCount}
          </Badge>
        </span>
        <span>{formatCurrency(subtotal)}</span>
      </Button>
    </div>
  )
}
