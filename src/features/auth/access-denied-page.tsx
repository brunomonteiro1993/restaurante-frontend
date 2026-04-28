import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AccessDeniedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Acesso negado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Voce nao tem permissao para acessar esta area.
          </p>
          <Link to="/dashboard" className={cn(buttonVariants({ variant: 'outline' }))}>
            Voltar para dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
