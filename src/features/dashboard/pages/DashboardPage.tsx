import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStatsCards } from '@/features/dashboard/components/DashboardStats'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { hasPermission } from '@/features/auth/role-permissions'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

const shortcuts = [
  { to: '/kitchen', label: 'Kitchen', permission: 'kitchen:view' as const },
  { to: '/orders', label: 'Pedidos', permission: 'orders:view' as const },
  { to: '/waiter-calls', label: 'Waiter Calls', permission: 'waiter-calls:view' as const },
  { to: '/bills', label: 'Fechamento', permission: 'bills:view' as const },
  { to: '/tables', label: 'Mesas', permission: 'tables:manage' as const },
  { to: '/products', label: 'Produtos', permission: 'products:manage' as const },
  { to: '/categories', label: 'Categorias', permission: 'categories:manage' as const },
]

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError } = useDashboard()

  const visibleShortcuts = user
    ? shortcuts.filter((s) => hasPermission(user.role, s.permission))
    : []

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
