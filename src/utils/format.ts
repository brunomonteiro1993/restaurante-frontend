const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatDateTime = (value: string | Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

export const formatTime = (value: string | Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
