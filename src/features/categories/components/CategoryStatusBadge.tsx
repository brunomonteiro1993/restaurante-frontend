import { Badge } from '@/components/ui/badge'

interface CategoryStatusBadgeProps {
  isActive: boolean
}

export function CategoryStatusBadge({ isActive }: CategoryStatusBadgeProps) {
  return (
    <Badge
      className={
        isActive
          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100'
          : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200'
      }
    >
      {isActive ? 'Ativa' : 'Inativa'}
    </Badge>
  )
}
