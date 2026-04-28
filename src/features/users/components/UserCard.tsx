import { Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRoleBadge } from '@/features/users/components/UserRoleBadge'
import { UserStatusBadge } from '@/features/users/components/UserStatusBadge'
import type { UserListItem } from '@/features/users/types/users.types'
import { formatDateTime } from '@/utils/format'

interface UserCardProps {
  user: UserListItem
  busy?: boolean
  onEdit: () => void
  onToggleStatus: () => void
}

export function UserCard({ user, busy, onEdit, onToggleStatus }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{user.name}</CardTitle>
          <div className="flex gap-2">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge isActive={user.isActive} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          <span>{user.email}</span>
          <span>Atualizado {formatDateTime(user.updatedAt)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onEdit}>
            <Pencil className="mr-1 size-3.5" />
            Editar
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onToggleStatus}>
            {user.isActive ? 'Inativar' : 'Reativar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
