export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  socketUrl: import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3333',
  appUrl: import.meta.env.VITE_APP_URL ?? window.location.origin,
}

/** URL base para QR do cardápio — em produção usa o domínio atual (evita VITE_APP_URL desatualizado no build). */
export function getMenuBaseUrl(): string {
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return window.location.origin
  }
  return env.appUrl
}
