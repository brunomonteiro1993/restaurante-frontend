import { AlertTriangle, ChefHat, ClipboardList, Table2, UtensilsCrossed } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardStats } from '@/features/dashboard/types/dashboard.types'

interface DashboardStatsProps {
  stats?: DashboardStats
  isLoading: boolean
}

const statCards = [
  { key: 'pendingOrders', label: 'Pedidos pendentes', icon: ClipboardList },
  { key: 'preparingOrders', label: 'Em preparo', icon: ChefHat },
  { key: 'readyOrders', label: 'Pedidos prontos', icon: UtensilsCrossed },
  { key: 'openWaiterCalls', label: 'Chamados abertos', icon: AlertTriangle },
  { key: 'tablesInUse', label: 'Mesas em uso', icon: Table2 },
] as const

export function DashboardStatsCards({ stats, isLoading }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-semibold">{stats?.[key] ?? 0}</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
