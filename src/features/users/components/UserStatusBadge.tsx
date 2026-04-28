import { Badge } from '@/components/ui/badge'

interface UserStatusBadgeProps {
  isActive: boolean
}

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return isActive ? (
    <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">Ativo</Badge>
  ) : (
    <Badge className="bg-zinc-200 text-zinc-800 hover:bg-zinc-200">Inativo</Badge>
  )
}
