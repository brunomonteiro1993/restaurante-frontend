import { PublicProductCard } from '@/features/public-menu/components/PublicProductCard'
import type { PublicMenuCategory, PublicMenuProduct } from '@/features/public-menu/types/public-menu.types'

interface PublicCategorySectionProps {
  category: PublicMenuCategory
  onAddProduct: (product: PublicMenuProduct) => void
}

export function PublicCategorySection({ category, onAddProduct }: PublicCategorySectionProps) {
  if (category.products.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">{category.name}</h2>
      <div className="grid gap-3">
        {category.products.map((product) => (
          <PublicProductCard key={product.id} product={product} onAdd={onAddProduct} />
        ))}
      </div>
    </section>
  )
}
