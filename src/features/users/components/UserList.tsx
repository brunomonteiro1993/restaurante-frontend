import { UserCard } from '@/features/users/components/UserCard'
import type { UserListItem } from '@/features/users/types/users.types'

interface UserListProps {
  users: UserListItem[]
  busy?: boolean
  onEdit: (user: UserListItem) => void
  onToggleStatus: (user: UserListItem) => void
}

export function UserList({ users, busy, onEdit, onToggleStatus }: UserListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          busy={busy}
          onEdit={() => onEdit(user)}
          onToggleStatus={() => onToggleStatus(user)}
        />
      ))}
    </div>
  )
}
