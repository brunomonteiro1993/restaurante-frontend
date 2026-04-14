import { zodResolver } from '@hookform/resolvers/zod'
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
import { TableFormFields } from '@/features/tables/components/TableForm'
import { useCreateTable } from '@/features/tables/hooks/useCreateTable'
import { createTableFormSchema, type CreateTableFormValues } from '@/features/tables/schemas/table-form.schema'

interface CreateTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTableDialog({ open, onOpenChange }: CreateTableDialogProps) {
  const createMutation = useCreateTable()

  const form = useForm<CreateTableFormValues>({
    resolver: zodResolver(createTableFormSchema),
    defaultValues: {
      number: '',
      capacity: 4,
      status: 'AVAILABLE',
    },
  })

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({
        number: '',
        capacity: 4,
        status: 'AVAILABLE',
      })
    }
    onOpenChange(next)
  }

  const onSubmit = (values: CreateTableFormValues) => {
    createMutation.mutate(
      {
        number: values.number,
        capacity: values.capacity,
        ...(values.status ? { status: values.status } : {}),
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
          <DialogTitle>Nova mesa</DialogTitle>
          <DialogDescription>Campos alinhados ao POST /tables do backend.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TableFormFields />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Salvando...' : 'Criar mesa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
