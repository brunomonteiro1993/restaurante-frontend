import type { PublicMenuRestaurant, PublicMenuTable } from '@/features/public-menu/types/public-menu.types'

interface PublicMenuHeaderProps {
  restaurant: PublicMenuRestaurant
  table: PublicMenuTable | null
}

export function PublicMenuHeader({ restaurant, table }: PublicMenuHeaderProps) {
  return (
    <header className="space-y-3 rounded-lg border bg-background p-4">
      <div className="flex items-center gap-3">
        {restaurant.logoUrl ? (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="h-14 w-14 rounded-md border object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
            Logo
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{restaurant.name}</h1>
          {table && <p className="text-sm text-muted-foreground">Mesa {table.number}</p>}
        </div>
      </div>
      {restaurant.description && (
        <p className="text-sm text-muted-foreground">{restaurant.description}</p>
      )}
    </header>
  )
}
