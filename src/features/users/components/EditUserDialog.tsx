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
import { UserFormFields } from '@/features/users/components/UserForm'
import { useUserDetails } from '@/features/users/hooks/useUserDetails'
import { useUpdateUser } from '@/features/users/hooks/useUpdateUser'
import {
  updateUserFormSchema,
  type UpdateUserFormValues,
} from '@/features/users/schemas/user-form.schema'

interface EditUserDialogProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ userId, open, onOpenChange }: EditUserDialogProps) {
  const { data, isLoading, isError, refetch } = useUserDetails(userId, open)
  const updateMutation = useUpdateUser()
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'WAITER',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
    })
  }, [data, form])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({ name: '', email: '', role: 'WAITER', isActive: true })
    }
    onOpenChange(next)
  }

  const onSubmit = (values: UpdateUserFormValues) => {
    if (!userId) return
    updateMutation.mutate(
      {
        id: userId,
        payload: {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
        },
      },
      { onSuccess: () => handleOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Dados carregados de GET /users/:id.</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Nao foi possivel carregar o usuario.{' '}
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </p>
        )}

        {data && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <UserFormFields includePasswordField={false} includeStatusField />
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
