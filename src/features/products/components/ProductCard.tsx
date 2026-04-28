import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductStatusBadge } from '@/features/products/components/ProductStatusBadge'
import type { ProductListItem } from '@/features/products/types/products.types'
import { formatCurrency } from '@/utils/format'

interface ProductCardProps {
  product: ProductListItem
  onEdit: () => void
  onDelete: () => void
  busy?: boolean
}

export function ProductCard({ product, onEdit, onDelete, busy }: ProductCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base">{product.name}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {product.category.name}
          </p>
        </div>
        <ProductStatusBadge isAvailable={product.isAvailable} />
      </CardHeader>
      <CardContent className="space-y-3">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-24 w-24 rounded-md border object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
        <p className="font-medium">{formatCurrency(product.price)}</p>
        {/* <p className="font-mono text-[11px] text-muted-foreground">ID {product.id}</p> */}
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onEdit}>
            <Pencil className="mr-1 size-3.5" />
            Editar
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onDelete}>
            <Trash2 className="mr-1 size-3.5" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
