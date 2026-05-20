import { useMemo, useRef } from 'react'
import { Download, Printer } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getMenuBaseUrl } from '@/lib/env'
import {
  TableQRCodePrintLayout,
} from '@/features/tables/components/TableQRCodePrintLayout'
import { printTableQrProfessionalLayout } from '@/features/tables/utils/qr-print.utils'
import { downloadDataUrl, svgMarkupToPngDataUrl } from '@/features/tables/utils/qr.utils'

interface TableQRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableNumber: string
  publicCode: string
  restaurantSlug: string
  restaurantName?: string
  restaurantLogoUrl?: string | null
}

export function TableQRCodeDialog({
  open,
  onOpenChange,
  tableNumber,
  publicCode,
  restaurantSlug,
  restaurantName,
  restaurantLogoUrl,
}: TableQRCodeDialogProps) {
  const layoutQrRef = useRef<HTMLDivElement | null>(null)

  const menuUrl = useMemo(
    () => `${getMenuBaseUrl()}/menu/${restaurantSlug}/table/${publicCode}`,
    [publicCode, restaurantSlug],
  )

  const handleDownload = async () => {
    try {
      const svg = layoutQrRef.current?.querySelector('svg')
      if (!svg) {
        toast.error('Nao foi possivel gerar o QR para download.')
        return
      }

      const svgMarkup = svg.outerHTML
      const pngDataUrl = await svgMarkupToPngDataUrl(svgMarkup, 1024)
      downloadDataUrl(pngDataUrl, `mesa-${tableNumber}.png`)
    } catch {
      toast.error('Falha ao baixar QR Code.')
    }
  }

  const handlePrintLayout = () => {
    const qrSvgMarkup = layoutQrRef.current?.innerHTML ?? ''
    if (!qrSvgMarkup) {
      toast.error('Nao foi possivel montar o layout de impressao.')
      return
    }

    const ok = printTableQrProfessionalLayout({
      restaurantName: restaurantName ?? 'Restaurante',
      restaurantLogoUrl,
      tableNumber,
      qrUrl: menuUrl,
      qrSvgMarkup,
    })

    if (!ok) {
      toast.error('Nao foi possivel abrir janela de impressao.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code da Mesa {tableNumber}</DialogTitle>
          <DialogDescription>Escaneie para abrir o cardapio publico da mesa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border border-dashed p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Preview layout profissional</p>
            <TableQRCodePrintLayout
              ref={layoutQrRef}
              restaurantName={restaurantName ?? 'Restaurante'}
              restaurantLogoUrl={restaurantLogoUrl}
              tableNumber={tableNumber}
              qrUrl={menuUrl}
              qrSize={180}
              className="max-w-[300px] scale-[0.95]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={handleDownload}>
            <Download className="mr-2 size-4" />
            Baixar PNG
          </Button>
          <Button type="button" onClick={handlePrintLayout}>
            <Printer className="mr-2 size-4" />
            Imprimir QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
