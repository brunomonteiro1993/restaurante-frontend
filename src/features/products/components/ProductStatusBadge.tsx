import { Badge } from '@/components/ui/badge'
import { statusBadgeClass } from '@/lib/status-badge'

interface ProductStatusBadgeProps {
  isAvailable: boolean
}

export function ProductStatusBadge({ isAvailable }: ProductStatusBadgeProps) {
  return (
    <Badge className={isAvailable ? statusBadgeClass.available : statusBadgeClass.unavailable}>
      {isAvailable ? 'Disponivel' : 'Indisponivel'}
    </Badge>
  )
}
