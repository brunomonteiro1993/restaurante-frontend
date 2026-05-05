import { useState } from 'react'
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PhoneCall,
  Receipt,
  SquareMenu,
  Table2,
  Users,
  UtensilsCrossed,
  X,
  LogOut,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { usePermission } from '@/features/auth/permissions/usePermission'
import type { Permission } from '@/features/auth/permissions/permissions'
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents'

const links = [
  { to: '/dashboard', label: 'Dashboard', permission: 'dashboard.read', icon: LayoutDashboard },
  { to: '/kitchen', label: 'Cozinha', permission: 'kitchen.read', icon: UtensilsCrossed },
  { to: '/orders', label: 'Pedidos', permission: 'orders.read', icon: ClipboardList },
  { to: '/waiter-calls', label: 'Chamados', permission: 'waiterCalls.read', icon: PhoneCall },
  { to: '/bills', label: 'Contas', permission: 'bills.read', icon: Receipt },
  { to: '/tables', label: 'Mesas', permission: 'tables.manage', icon: Table2 },
  { to: '/categories', label: 'Categorias', permission: 'categories.manage', icon: SquareMenu },
  { to: '/products', label: 'Produtos', permission: 'products.manage', icon: Boxes },
  { to: '/users', label: 'Usuarios', permission: 'users.manage', icon: Users },
] as const satisfies ReadonlyArray<{ to: string; label: string; permission: Permission; icon: typeof LayoutDashboard }>

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const { can } = usePermission()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  useRealtimeEvents()
  const visibleLinks = user ? links.filter((link) => can(link.permission)) : []

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <LayoutDashboard className="size-4" />
              {user?.name ? `Painel ${user.name.split(' ')[0]}` : 'Restaurante SaaS'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
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

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={`fixed inset-y-16 left-0 z-50 w-60 border-r bg-background p-3 transition-transform duration-200 md:static md:inset-auto md:z-auto md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-2 flex items-center justify-between px-2 md:hidden">
            <span className="text-xs font-medium text-muted-foreground">Menu</span>
            <Button variant="ghost" size="icon-sm" onClick={() => setMobileSidebarOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  <Icon className="size-4" />
                  {link.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <section className="w-full p-6">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}
