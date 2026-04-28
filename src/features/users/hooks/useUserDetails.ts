import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { usersService } from '@/features/users/services/users.service'

export const useUserDetails = (id: string | null, enabled: boolean) =>
  useQuery({
    queryKey: id ? queryKeys.users.detail(id) : ['users', 'detail', 'none'],
    queryFn: () => usersService.getById(id!),
    enabled: Boolean(id) && enabled,
  })
