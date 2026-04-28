import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryStatusBadge } from '@/features/categories/components/CategoryStatusBadge'
import type { Category } from '@/features/categories/types/categories.types'
import { formatDateTime } from '@/utils/format'

interface CategoryCardProps {
  category: Category
  onEdit: () => void
  onDelete: () => void
  busy?: boolean
}

export function CategoryCard({ category, onEdit, onDelete, busy }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base">{category.name}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Atualizado {formatDateTime(category.updatedAt)}
          </p>
        </div>
        <CategoryStatusBadge isActive={category.isActive} />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* <p className="font-mono text-[11px] text-muted-foreground">ID {category.id}</p> */}
        <p className="text-sm text-muted-foreground">
          {category.description?.trim() || 'Sem descricao.'}
        </p>
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
