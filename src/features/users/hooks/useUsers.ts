import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { usersService } from '@/features/users/services/users.service'
import type { UserListFilters } from '@/features/users/types/users.types'

export const useUsers = (filters: UserListFilters) =>
  useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersService.list(filters),
  })
