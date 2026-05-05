import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicCartButton } from '@/features/public-cart/components/PublicCartButton'
import { PublicCartDrawer } from '@/features/public-cart/components/PublicCartDrawer'
import { PublicCartProvider, usePublicCart } from '@/features/public-cart/hooks/usePublicCart'
import { PublicCategorySection } from '@/features/public-menu/components/PublicCategorySection'
import { PublicMenuHeader } from '@/features/public-menu/components/PublicMenuHeader'
import { usePublicMenu } from '@/features/public-menu/hooks/usePublicMenu'
import { PublicOrderTrackingButton } from '@/features/public-order-tracking/components/PublicOrderTrackingButton'
import { PublicWaiterCallButton } from '@/features/public-waiter-call/components/PublicWaiterCallButton'
import { useState } from 'react'

export function PublicMenuPage() {
  const params = useParams<{ restaurantSlug: string; tableCode: string }>()
  const restaurantSlug = params.restaurantSlug?.trim()
  const tableCode = params.tableCode?.trim()
  if (!restaurantSlug || !tableCode) {
    return null
  }

  return (
    <PublicCartProvider restaurantSlug={restaurantSlug} tableCode={tableCode}>
      <PublicMenuPageContent restaurantSlug={restaurantSlug} tableCode={tableCode} />
    </PublicCartProvider>
  )
}

function PublicMenuPageContent({
  restaurantSlug,
  tableCode,
}: {
  restaurantSlug: string
  tableCode: string
}) {
  const { data, isLoading, isError } = usePublicMenu(restaurantSlug, tableCode)
  const { addItem, itemsCount, subtotal } = usePublicCart()
  const [cartOpen, setCartOpen] = useState(false)

  const visibleCategories = useMemo(
    () => (data?.categories ?? []).filter((category) => category.products.length > 0),
    [data?.categories],
  )

  return (
    <div className="space-y-4 pb-28 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {isLoading && (
        <>
          <Card className="rounded-2xl border shadow-sm">
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border shadow-sm">
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
        <Card className="rounded-2xl border-destructive/40 shadow-sm">
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
          <PublicWaiterCallButton restaurantSlug={restaurantSlug} tableCode={tableCode} />
          <PublicOrderTrackingButton restaurantSlug={restaurantSlug} tableCode={tableCode} />
          {visibleCategories.length === 0 ? (
            <Card className="rounded-2xl border shadow-sm">
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
                <PublicCategorySection
                  key={category.id}
                  category={category}
                  onAddProduct={(product) =>
                    addItem({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                    })
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      <PublicCartButton itemsCount={itemsCount} subtotal={subtotal} onClick={() => setCartOpen(true)} />
      <PublicCartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        restaurantSlug={restaurantSlug}
        tableCode={tableCode}
      />
    </div>
  )
}
