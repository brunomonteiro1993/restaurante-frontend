import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { usersService } from '@/features/users/services/users.service'

interface MutationInput {
  id: string
  isActive: boolean
}

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: MutationInput) => usersService.update(id, { isActive }),
    onSuccess: (data, variables) => {
      toast.success(data.isActive ? 'Usuario reativado.' : 'Usuario inativado.')
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar o status do usuario.')
        return
      }
      toast.error('Nao foi possivel atualizar o status do usuario.')
    },
  })
}
