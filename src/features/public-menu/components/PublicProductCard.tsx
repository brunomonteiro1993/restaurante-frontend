import { Card, CardContent } from '@/components/ui/card'
import type { PublicMenuProduct } from '@/features/public-menu/types/public-menu.types'
import { formatCurrency } from '@/utils/format'

interface PublicProductCardProps {
  product: PublicMenuProduct
}

export function PublicProductCard({ product }: PublicProductCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-32 w-full rounded-md border object-cover"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{product.name}</h3>
          {product.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          )}
          <p className="text-sm font-medium">{formatCurrency(product.price)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
