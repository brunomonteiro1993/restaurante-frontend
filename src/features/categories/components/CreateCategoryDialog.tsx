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
import { CategoryFormFields } from '@/features/categories/components/CategoryForm'
import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory'
import {
  createCategoryFormSchema,
  type CreateCategoryFormValues,
} from '@/features/categories/schemas/category-form.schema'

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
  const createMutation = useCreateCategory()

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({ name: '', description: '' })
    }
    onOpenChange(next)
  }

  const onSubmit = (values: CreateCategoryFormValues) => {
    createMutation.mutate(
      {
        name: values.name,
        ...(values.description?.trim() ? { description: values.description.trim() } : {}),
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
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Campos alinhados ao POST /categories do backend.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CategoryFormFields includeActiveField={false} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Salvando...' : 'Criar categoria'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
