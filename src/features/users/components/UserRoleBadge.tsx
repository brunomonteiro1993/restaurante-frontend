import { Badge } from '@/components/ui/badge'
import type { UserRole } from '@/features/auth/types/auth.types'

interface UserRoleBadgeProps {
  role: UserRole
}

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  ADMIN: { label: 'Admin', className: 'bg-purple-100 text-purple-900 hover:bg-purple-100' },
  MANAGER: { label: 'Gerente', className: 'bg-blue-100 text-blue-900 hover:bg-blue-100' },
  WAITER: { label: 'Garcom', className: 'bg-amber-100 text-amber-900 hover:bg-amber-100' },
  KITCHEN: { label: 'Cozinha', className: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100' },
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return <Badge className={roleConfig[role].className}>{roleConfig[role].label}</Badge>
}
