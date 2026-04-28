import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicCategorySection } from '@/features/public-menu/components/PublicCategorySection'
import { PublicMenuHeader } from '@/features/public-menu/components/PublicMenuHeader'
import { usePublicMenu } from '@/features/public-menu/hooks/usePublicMenu'

export function PublicMenuPage() {
  const params = useParams<{ restaurantSlug: string; tableCode: string }>()
  const restaurantSlug = params.restaurantSlug?.trim()
  const tableCode = params.tableCode?.trim()
  const { data, isLoading, isError } = usePublicMenu(restaurantSlug, tableCode)

  const visibleCategories = useMemo(
    () => (data?.categories ?? []).filter((category) => category.products.length > 0),
    [data?.categories],
  )

  return (
    <div className="space-y-4">
      {isLoading && (
        <>
          <Card>
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-2 p-3">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {isError && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Nao foi possivel carregar o cardapio</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Verifique se o restaurante e a mesa sao validos para este link.
          </CardContent>
        </Card>
      )}

      {!isLoading && data && (
        <>
          <PublicMenuHeader restaurant={data.restaurant} table={data.table} />
          {visibleCategories.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Nenhum item disponivel</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Este cardapio ainda nao possui produtos disponiveis no momento.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {visibleCategories.map((category) => (
                <PublicCategorySection key={category.id} category={category} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
