import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteTable } from '@/features/tables/hooks/useDeleteTable'
import type { Table } from '@/features/tables/types/tables.types'

interface DeleteTableDialogProps {
  table: Table | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTableDialog({ table, open, onOpenChange }: DeleteTableDialogProps) {
  const deleteMutation = useDeleteTable()

  const handleConfirm = () => {
    if (!table) return
    deleteMutation.mutate(table.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir mesa</DialogTitle>
          <DialogDescription>
            {table
              ? `Confirma a exclusao da mesa ${table.number}? Esta acao nao pode ser desfeita. O backend bloqueia exclusao se existirem pedidos ou chamados vinculados a mesa.`
              : 'Nenhuma mesa selecionada.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" disabled={!table || deleteMutation.isPending} onClick={handleConfirm}>
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
