import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PublicOrderStatusCard } from '@/features/public-order-tracking/components/PublicOrderStatusCard'
import { usePublicOrderTracking } from '@/features/public-order-tracking/hooks/usePublicOrderTracking'

interface PublicOrderTrackingButtonProps {
  restaurantSlug: string
  tableCode: string
}

export function PublicOrderTrackingButton({
  restaurantSlug,
  tableCode,
}: PublicOrderTrackingButtonProps) {
  const [open, setOpen] = useState(false)
  const { lastOrder, data, isLoading, isError } = usePublicOrderTracking(restaurantSlug, tableCode)

  if (!lastOrder) return null

  return (
    <>
      <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(true)}>
        Acompanhar pedido
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Status do pedido</DialogTitle>
          <DialogDescription>Atualizacao do pedido da sua mesa.</DialogDescription>
        </DialogHeader>
        {isLoading && <p className="text-sm text-muted-foreground">Carregando status do pedido...</p>}
        {isError && (
          <p className="text-sm text-destructive">
            Nao foi possivel consultar o acompanhamento do pedido agora.
          </p>
        )}
        {!isLoading && !isError && (
          <PublicOrderStatusCard
            lastOrder={lastOrder}
            trackingData={data}
          />
        )}
      </DialogContent>
      </Dialog>
    </>
  )
}
