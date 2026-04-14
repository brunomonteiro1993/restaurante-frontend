import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { TableFormFields } from '@/features/tables/components/TableForm'
import { useTableDetail } from '@/features/tables/hooks/useTableDetail'
import { useUpdateTable } from '@/features/tables/hooks/useUpdateTable'
import { updateTableFormSchema, type UpdateTableFormValues } from '@/features/tables/schemas/table-form.schema'

interface EditTableDialogProps {
  tableId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTableDialog({ tableId, open, onOpenChange }: EditTableDialogProps) {
  const { data, isLoading, isError, refetch } = useTableDetail(tableId, open)
  const updateMutation = useUpdateTable()

  const form = useForm<UpdateTableFormValues>({
    resolver: zodResolver(updateTableFormSchema),
    defaultValues: {
      number: '',
      capacity: 1,
      status: 'AVAILABLE',
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      number: data.number,
      capacity: data.capacity,
      status: data.status,
    })
  }, [data, form])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({ number: '', capacity: 1, status: 'AVAILABLE' })
    }
    onOpenChange(next)
  }

  const onSubmit = (values: UpdateTableFormValues) => {
    if (!tableId) return
    updateMutation.mutate(
      {
        id: tableId,
        payload: {
          number: values.number,
          capacity: values.capacity,
          status: values.status,
        },
      },
      {
        onSuccess: () => handleOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar mesa</DialogTitle>
          <DialogDescription>Dados carregados de GET /tables/:id.</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Nao foi possivel carregar a mesa.{' '}
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </p>
        )}

        {data && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TableFormFields />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
