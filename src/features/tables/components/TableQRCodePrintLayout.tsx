import { forwardRef, type ForwardedRef } from 'react'
import QRCode from 'react-qr-code'

interface TableQRCodePrintLayoutProps {
  restaurantName: string
  restaurantLogoUrl?: string | null
  tableNumber: string
  qrUrl: string
  qrSize?: number
  className?: string
}

export const TableQRCodePrintLayout = forwardRef(function TableQRCodePrintLayout(
  {
    restaurantName,
    restaurantLogoUrl,
    tableNumber,
    qrUrl,
    qrSize = 220,
    className,
  }: TableQRCodePrintLayoutProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <article
      className={`mx-auto w-full max-w-[390px] rounded-xl border bg-white p-4 text-center text-black shadow-sm ${className ?? ''}`.trim()}
    >
      <header className="space-y-2">
        {restaurantLogoUrl ? (
          <img
            src={restaurantLogoUrl}
            alt={`Logo ${restaurantName}`}
            className="mx-auto h-12 w-12 rounded-full object-cover"
          />
        ) : null}
        <h2 className="text-lg font-semibold leading-tight">{restaurantName}</h2>
        <p className="text-base font-medium">Mesa {tableNumber}</p>
      </header>

      <div className="my-4 flex justify-center">
        <div ref={ref} className="rounded-lg border p-3">
          <QRCode value={qrUrl} size={qrSize} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-base font-semibold">Escaneie e faca seu pedido</p>
        <p className="text-xs text-neutral-600">Aponte a camera do celular para acessar o cardapio.</p>
        <p className="text-xs text-neutral-600">Voce tambem pode chamar o garcom pelo celular.</p>
      </div>

      {/* URL opcional sob o QR (oculta por padrão no layout atual). */}
      {/* {showUrl ? <p className="mt-3 text-[10px] text-neutral-500 break-all">{qrUrl}</p> : null} */}
    </article>
  )
})
