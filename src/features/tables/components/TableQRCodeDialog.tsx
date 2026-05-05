import { useMemo, useRef } from 'react'
import QRCode from 'react-qr-code'
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
import { env } from '@/lib/env'
import { downloadDataUrl, svgMarkupToPngDataUrl } from '@/features/tables/utils/qr.utils'

interface TableQRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableNumber: string
  publicCode: string
  restaurantSlug: string
  restaurantName?: string
}

export function TableQRCodeDialog({
  open,
  onOpenChange,
  tableNumber,
  publicCode,
  restaurantSlug,
  restaurantName,
}: TableQRCodeDialogProps) {
  const qrRef = useRef<HTMLDivElement | null>(null)

  const menuUrl = useMemo(
    () => `${env.appUrl}/menu/${restaurantSlug}/table/${publicCode}`,
    [publicCode, restaurantSlug],
  )

  const handleDownload = async () => {
    try {
      const svg = qrRef.current?.querySelector('svg')
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      toast.error('Nao foi possivel abrir janela de impressao.')
      return
    }

    const title = `QR Code da Mesa ${tableNumber}`
    const safeRestaurantName = restaurantName ?? 'Restaurante'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              min-height: 100vh;
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff;
            }
            .sheet {
              width: 100%;
              max-width: 780px;
              padding: 32px;
              text-align: center;
            }
            h1 { margin: 0; font-size: 32px; }
            h2 { margin: 16px 0 6px; font-size: 24px; }
            p { margin: 0; color: #555555; }
            .qr-wrap { margin: 28px auto 20px; width: 360px; height: 360px; }
            .qr-wrap svg { width: 100%; height: 100%; }
            .url {
              margin-top: 12px;
              font-size: 12px;
              word-break: break-all;
              color: #666666;
            }
            @media print {
              body { min-height: auto; }
              .sheet { padding: 18mm; max-width: none; }
            }
          </style>
        </head>
        <body>
          <main class="sheet">
            <h1>${safeRestaurantName}</h1>
            <h2>Mesa ${tableNumber}</h2>
            <p>Escaneie para abrir o cardapio</p>
            <div class="qr-wrap">
              <div id="qr-container"></div>
            </div>
            <p class="url">${menuUrl}</p>
          </main>
          <script>
            const qrSvg = ${JSON.stringify(qrRef.current?.innerHTML ?? '')};
            document.getElementById('qr-container').innerHTML = qrSvg;
            window.onload = () => {
              window.focus();
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code da Mesa {tableNumber}</DialogTitle>
          <DialogDescription>Escaneie para abrir o cardapio publico da mesa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div
            ref={qrRef}
            className="mx-auto flex w-fit items-center justify-center rounded-lg border bg-white p-4 shadow-sm"
          >
            <QRCode value={menuUrl} size={220} />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">Mesa {tableNumber}</p>
            <p className="text-xs text-muted-foreground break-all">{menuUrl}</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={handleDownload}>
            <Download className="mr-2 size-4" />
            Baixar PNG
          </Button>
          <Button type="button" onClick={handlePrint}>
            <Printer className="mr-2 size-4" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
