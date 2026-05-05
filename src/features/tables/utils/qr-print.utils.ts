function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

interface PrintLayoutOptions {
  restaurantName: string
  restaurantLogoUrl?: string | null
  tableNumber: string
  qrUrl: string
  qrSvgMarkup: string
}

export function printTableQrProfessionalLayout({
  restaurantName,
  restaurantLogoUrl,
  tableNumber,
  qrUrl,
  qrSvgMarkup,
}: PrintLayoutOptions): boolean {
  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) return false

  const safeRestaurantName = escapeHtml(restaurantName || 'Restaurante')
  const safeTableNumber = escapeHtml(tableNumber)
  const safeUrl = escapeHtml(qrUrl)
  const logoBlock = restaurantLogoUrl
    ? `<img src="${escapeHtml(restaurantLogoUrl)}" alt="Logo ${safeRestaurantName}" class="logo" />`
    : ''

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>QR Mesa ${safeTableNumber}</title>
        <style>
          @page { size: auto; margin: 6mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #fff;
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
          }
          .page {
            width: 100%;
            min-height: calc(100vh - 1px);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            width: 76mm;
            border: 1px solid #d4d4d8;
            border-radius: 12px;
            padding: 6mm 5mm;
            text-align: center;
            background: #fff;
          }
          .logo {
            width: 12mm;
            height: 12mm;
            margin: 0 auto 2mm;
            border-radius: 999px;
            object-fit: cover;
          }
          .restaurant { margin: 0; font-size: 11pt; font-weight: 700; line-height: 1.2; }
          .table { margin: 1.5mm 0 0; font-size: 10pt; font-weight: 600; }
          .qr-box {
            margin: 4mm auto 3.5mm;
            width: 44mm;
            height: 44mm;
            border: 1px solid #e4e4e7;
            border-radius: 6px;
            padding: 2mm;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .qr-box svg { width: 100%; height: 100%; }
          .main-text { margin: 0; font-size: 9pt; font-weight: 700; }
          .sub-text { margin: 1mm 0 0; font-size: 7.2pt; color: #444; line-height: 1.3; }
          /* URL opcional sob o QR.
          .url {
            margin: 3mm 0 0;
            font-size: 6pt;
            color: #666;
            word-break: break-all;
          }
          */
        </style>
      </head>
      <body>
        <main class="page">
          <section class="card">
            ${logoBlock}
            <h1 class="restaurant">${safeRestaurantName}</h1>
            <p class="table">Mesa ${safeTableNumber}</p>
            <div class="qr-box"><div id="qr-container"></div></div>
            <p class="main-text">Escaneie e faca seu pedido</p>
            <p class="sub-text">Aponte a camera do celular para acessar o cardapio.</p>
            <p class="sub-text">Voce tambem pode chamar o garcom pelo celular.</p>
            <!-- URL opcional sob o QR (oculta no layout atual). -->
            <!-- <p class="url">${safeUrl}</p> -->
          </section>
        </main>
        <script>
          document.getElementById('qr-container').innerHTML = ${JSON.stringify(qrSvgMarkup)};
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
