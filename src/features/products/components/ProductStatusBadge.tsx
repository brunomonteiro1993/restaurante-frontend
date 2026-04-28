import { Badge } from '@/components/ui/badge'

interface ProductStatusBadgeProps {
  isAvailable: boolean
}

export function ProductStatusBadge({ isAvailable }: ProductStatusBadgeProps) {
  return (
    <Badge
      className={
        isAvailable
          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100'
          : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200'
      }
    >
      {isAvailable ? 'Disponivel' : 'Indisponivel'}
    </Badge>
  )
}
