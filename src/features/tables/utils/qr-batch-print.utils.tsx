import { renderToStaticMarkup } from 'react-dom/server'

import {
  TableQRCodesBatchPrint,
  type BatchTableQRCodeItem,
} from '@/features/tables/components/TableQRCodesBatchPrint'

interface PrintBatchQRCodesOptions {
  restaurantName: string
  restaurantLogoUrl?: string | null
  restaurantSlug: string
  tables: BatchTableQRCodeItem[]
}

function collectCurrentDocumentStyles(): string {
  const nodes = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
  return nodes
    .map((node) => {
      if (node instanceof HTMLStyleElement) return node.outerHTML
      if (node instanceof HTMLLinkElement) return node.outerHTML
      return ''
    })
    .join('\n')
}

export function printTableQRCodesBatch({
  restaurantName,
  restaurantLogoUrl,
  restaurantSlug,
  tables,
}: PrintBatchQRCodesOptions): boolean {
  const printWindow = window.open('', '_blank', 'width=1280,height=900')
  if (!printWindow) return false

  const rendered = renderToStaticMarkup(
    <TableQRCodesBatchPrint
      restaurantName={restaurantName}
      restaurantLogoUrl={restaurantLogoUrl}
      restaurantSlug={restaurantSlug}
      tables={tables}
    />,
  )

  const inheritedStyles = collectCurrentDocumentStyles()

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Impressao em lote - QRs das mesas</title>
        ${inheritedStyles}
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body {
            margin: 0;
            background: #fff;
            color: #111;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .qr-batch-page {
            width: 100%;
          }
          .qr-batch-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8mm;
            align-items: start;
          }
          .qr-batch-card {
            width: 100%;
            break-inside: avoid-page;
            page-break-inside: avoid;
          }
          @media print {
            .qr-batch-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 7mm;
            }
            .qr-batch-card {
              break-inside: avoid-page;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${rendered}
        <script>
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

  return true
}
