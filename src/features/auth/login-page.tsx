import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      <p className="text-sm text-muted-foreground">
        Acesse a area interna para gerenciar operacoes do restaurante.
      </p>
      <LoginForm />
    </div>
  )
}
