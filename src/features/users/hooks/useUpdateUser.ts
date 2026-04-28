import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { usersService } from '@/features/users/services/users.service'
import type { UpdateUserPayload } from '@/features/users/types/users.types'

interface MutationInput {
  id: string
  payload: UpdateUserPayload
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: MutationInput) => usersService.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success('Usuario atualizado.')
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel atualizar o usuario.')
        return
      }
      toast.error('Nao foi possivel atualizar o usuario.')
    },
  })
}
