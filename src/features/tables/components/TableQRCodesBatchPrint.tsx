import { env } from '@/lib/env'
import { TableQRCodePrintLayout } from '@/features/tables/components/TableQRCodePrintLayout'
import type { TableStatus } from '@/features/tables/types/tables.types'

export interface BatchTableQRCodeItem {
  id: string
  number: string
  publicCode: string
  status: TableStatus
}

interface TableQRCodesBatchPrintProps {
  restaurantName: string
  restaurantLogoUrl?: string | null
  restaurantSlug: string
  tables: BatchTableQRCodeItem[]
}

export function TableQRCodesBatchPrint({
  restaurantName,
  restaurantLogoUrl,
  restaurantSlug,
  tables,
}: TableQRCodesBatchPrintProps) {
  return (
    <main className="qr-batch-page">
      <section className="qr-batch-grid">
        {tables.map((table) => {
          const qrUrl = `${env.appUrl}/menu/${restaurantSlug}/table/${table.publicCode}`
          return (
            <TableQRCodePrintLayout
              key={table.id}
              restaurantName={restaurantName}
              restaurantLogoUrl={restaurantLogoUrl}
              tableNumber={table.number}
              qrUrl={qrUrl}
              qrSize={180}
              className="qr-batch-card !max-w-none !shadow-none"
            />
          )
        })}
      </section>
    </main>
  )
}
