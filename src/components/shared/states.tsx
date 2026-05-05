import { AlertCircle, Inbox } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <Inbox className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Card className="rounded-2xl border-destructive/40 shadow-sm">
      <CardContent className="flex items-center gap-2 py-4 text-sm text-destructive">
        <AlertCircle className="size-4" />
        {message}
      </CardContent>
    </Card>
  )
}

interface LoadingCardsProps {
  count?: number
}

export function LoadingCards({ count = 4 }: LoadingCardsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="rounded-2xl border shadow-sm">
          <CardContent className="space-y-2 py-4">
            <Skeleton className="h-5 w-36 animate-pulse" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-3/4 animate-pulse" />
            <Skeleton className="h-9 w-32 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
