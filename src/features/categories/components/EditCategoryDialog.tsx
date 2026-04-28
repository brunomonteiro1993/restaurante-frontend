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
import { CategoryFormFields } from '@/features/categories/components/CategoryForm'
import { useCategoryDetail } from '@/features/categories/hooks/useCategoryDetail'
import { useUpdateCategory } from '@/features/categories/hooks/useUpdateCategory'
import {
  updateCategoryFormSchema,
  type UpdateCategoryFormValues,
} from '@/features/categories/schemas/category-form.schema'

interface EditCategoryDialogProps {
  categoryId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryDialog({
  categoryId,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const { data, isLoading, isError, refetch } = useCategoryDetail(categoryId, open)
  const updateMutation = useUpdateCategory()

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      name: data.name,
      description: data.description ?? '',
      isActive: data.isActive,
    })
  }, [data, form])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({ name: '', description: '', isActive: true })
    }
    onOpenChange(next)
  }

  const onSubmit = (values: UpdateCategoryFormValues) => {
    if (!categoryId) return
    updateMutation.mutate(
      {
        id: categoryId,
        payload: {
          name: values.name,
          description: values.description?.trim() ? values.description.trim() : null,
          isActive: values.isActive,
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
          <DialogTitle>Editar categoria</DialogTitle>
          <DialogDescription>Dados carregados de GET /categories/:id.</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Nao foi possivel carregar a categoria.{' '}
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </p>
        )}

        {data && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CategoryFormFields includeActiveField />

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
