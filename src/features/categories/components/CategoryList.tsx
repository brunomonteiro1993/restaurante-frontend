import { CategoryCard } from '@/features/categories/components/CategoryCard'
import type { Category } from '@/features/categories/types/categories.types'

interface CategoryListProps {
  categories: Category[]
  busy?: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryList({ categories, busy, onEdit, onDelete }: CategoryListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          busy={busy}
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
        />
      ))}
    </div>
  )
}
