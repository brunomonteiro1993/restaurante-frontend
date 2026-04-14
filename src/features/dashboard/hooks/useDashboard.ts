import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'

export const useDashboard = () =>
  useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardService.getStats,
  })
