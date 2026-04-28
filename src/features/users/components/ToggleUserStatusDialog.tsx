import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToggleUserStatus } from '@/features/users/hooks/useToggleUserStatus'
import type { UserListItem } from '@/features/users/types/users.types'

interface ToggleUserStatusDialogProps {
  user: UserListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ToggleUserStatusDialog({
  user,
  open,
  onOpenChange,
}: ToggleUserStatusDialogProps) {
  const toggleMutation = useToggleUserStatus()

  const handleConfirm = () => {
    if (!user) return
    toggleMutation.mutate(
      { id: user.id, isActive: !user.isActive },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  const actionLabel = user?.isActive ? 'Inativar' : 'Reativar'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{actionLabel} usuario</DialogTitle>
          <DialogDescription>
            {user
              ? `Confirma ${actionLabel.toLowerCase()} o usuario "${user.name}"?`
              : 'Nenhum usuario selecionado.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={!user || toggleMutation.isPending} onClick={handleConfirm}>
            {toggleMutation.isPending ? 'Salvando...' : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
