import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStatsCards } from '@/features/dashboard/components/DashboardStats'
import { usePermission } from '@/features/auth/permissions/usePermission'
import type { Permission } from '@/features/auth/permissions/permissions'
import { cn } from '@/lib/utils'
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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard operacional</h1>
        <p className="text-sm text-muted-foreground">
          Visao rapida da operacao do restaurante em tempo real de consulta.
        </p>
      </div>

      {isError && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">
            Nao foi possivel carregar os indicadores da dashboard.
          </CardContent>
        </Card>
      )}

      <DashboardStatsCards stats={data} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atalhos rapidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {visibleShortcuts.map((shortcut) => (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className={cn(buttonVariants({ variant: 'outline' }), 'justify-between')}
            >
              {shortcut.label}
              <ArrowRight className="size-4" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
