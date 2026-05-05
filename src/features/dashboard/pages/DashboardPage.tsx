import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { ErrorState } from '@/components/shared/states'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStatsCards } from '@/features/dashboard/components/DashboardStats'
import { usePermission } from '@/features/auth/permissions/usePermission'
import type { Permission } from '@/features/auth/permissions/permissions'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

const shortcuts = [
  { to: '/kitchen', label: 'Kitchen', permission: 'kitchen.read' },
  { to: '/orders', label: 'Pedidos', permission: 'orders.read' },
  { to: '/waiter-calls', label: 'Waiter Calls', permission: 'waiterCalls.read' },
  { to: '/bills', label: 'Fechamento', permission: 'bills.read' },
  { to: '/tables', label: 'Mesas', permission: 'tables.manage' },
  { to: '/products', label: 'Produtos', permission: 'products.manage' },
  { to: '/categories', label: 'Categorias', permission: 'categories.manage' },
] as const satisfies ReadonlyArray<{ to: string; label: string; permission: Permission }>

export function DashboardPage() {
  const { can } = usePermission()
  const { data, isLoading, isError } = useDashboard()

  const visibleShortcuts = shortcuts.filter((s) => can(s.permission))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard operacional"
        subtitle="Visao rapida da operacao do restaurante em tempo real."
      />

      {isError && (
        <ErrorState message="Nao foi possivel carregar os indicadores da dashboard." />
      )}

      <DashboardStatsCards stats={data} isLoading={isLoading} />

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Atalhos rapidos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {visibleShortcuts.map((shortcut) => (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className="rounded-2xl border bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{shortcut.label}</p>
                  <p className="text-xs text-muted-foreground">Acessar modulo</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
