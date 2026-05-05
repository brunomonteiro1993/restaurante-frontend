import { LayoutDashboard, LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { usePermission } from '@/features/auth/permissions/usePermission'
import type { Permission } from '@/features/auth/permissions/permissions'
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents'

const links = [
  { to: '/dashboard', label: 'Dashboard', permission: 'dashboard.read' },
  { to: '/kitchen', label: 'Kitchen', permission: 'kitchen.read' },
  { to: '/orders', label: 'Pedidos', permission: 'orders.read' },
  { to: '/waiter-calls', label: 'Chamados', permission: 'waiterCalls.read' },
  { to: '/bills', label: 'Fechamento', permission: 'bills.read' },
  { to: '/tables', label: 'Mesas', permission: 'tables.manage' },
  { to: '/products', label: 'Produtos', permission: 'products.manage' },
  { to: '/categories', label: 'Categorias', permission: 'categories.manage' },
  { to: '/users', label: 'Usuarios', permission: 'users.manage' },
] as const satisfies ReadonlyArray<{ to: string; label: string; permission: Permission }>

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const { can } = usePermission()
  useRealtimeEvents()
  const visibleLinks = user ? links.filter((link) => can(link.permission)) : []

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LayoutDashboard className="size-4" />
            Restaurante SaaS
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {user?.name} ({user?.role})
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-1 size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <div className="container grid gap-4 py-4 md:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border bg-background p-2">
          <nav className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="space-y-4">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
