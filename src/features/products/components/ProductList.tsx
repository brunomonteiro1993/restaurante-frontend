import { ProductCard } from '@/features/products/components/ProductCard'
import type { ProductListItem } from '@/features/products/types/products.types'

interface ProductListProps {
  products: ProductListItem[]
  busy?: boolean
  onEdit: (product: ProductListItem) => void
  onDelete: (product: ProductListItem) => void
}

export function ProductList({ products, busy, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          busy={busy}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
        />
      ))}
    </div>
  )
}
