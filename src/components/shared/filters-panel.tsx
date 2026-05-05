import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FiltersPanelProps {
  title?: string
  children: ReactNode
  className?: string
}

export function FiltersPanel({ title = 'Filtros', children, className }: FiltersPanelProps) {
  return (
    <Card className={cn('gap-0 py-0 shadow-sm', className)}>
      <CardHeader className="border-b px-4 py-3 md:px-5">
        <CardTitle className="text-sm font-medium leading-none">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-4 md:px-5 md:py-5">{children}</CardContent>
    </Card>
  )
}
