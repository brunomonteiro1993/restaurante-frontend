import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import type { ApiErrorResponse } from '@/features/auth/types/auth.types'
import { usersService } from '@/features/users/services/users.service'
import type { CreateUserPayload } from '@/features/users/types/users.types'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      toast.success('Usuario criado.')
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message ?? 'Nao foi possivel criar o usuario.')
        return
      }
      toast.error('Nao foi possivel criar o usuario.')
    },
  })
}
