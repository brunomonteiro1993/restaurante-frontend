import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

const order = ['light', 'dark', 'system'] as const

type ThemeMode = (typeof order)[number]

function nextTheme(current: string | undefined): ThemeMode {
  const normalized: ThemeMode = current === 'light' || current === 'dark' || current === 'system' ? current : 'system'
  const idx = order.indexOf(normalized)
  return order[(idx + 1) % order.length]
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const current = (theme ?? 'system') as ThemeMode
  const Icon = current === 'light' ? Sun : current === 'dark' ? Moon : Laptop
  const label = current === 'light' ? 'Tema claro' : current === 'dark' ? 'Tema escuro' : 'Tema do sistema'

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(nextTheme(theme))}
      className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      title={label}
      aria-label={label}
    >
      <Icon className="mr-2 size-4" />
      {current === 'light' ? 'Claro' : current === 'dark' ? 'Escuro' : 'Sistema'}
    </Button>
  )
}
