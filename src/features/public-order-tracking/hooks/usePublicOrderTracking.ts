import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { publicOrderTrackingService } from '@/features/public-order-tracking/services/public-order-tracking.service'
import type {
  PublicLastOrderSnapshot,
  PublicOrderTrackingResult,
} from '@/features/public-order-tracking/types/public-order-tracking.types'

export function getPublicLastOrderStorageKey(restaurantSlug: string, tableCode: string): string {
  return `public-last-order:${restaurantSlug}:${tableCode}`
}

export function savePublicLastOrder(snapshot: PublicLastOrderSnapshot): void {
  if (typeof window === 'undefined') return
  const key = getPublicLastOrderStorageKey(snapshot.restaurantSlug, snapshot.tableCode)
  window.localStorage.setItem(key, JSON.stringify(snapshot))
}

export function loadPublicLastOrder(
  restaurantSlug: string,
  tableCode: string,
): PublicLastOrderSnapshot | null {
  if (typeof window === 'undefined') return null
  const key = getPublicLastOrderStorageKey(restaurantSlug, tableCode)
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as PublicLastOrderSnapshot
    if (!parsed?.orderId) return null
    return parsed
  } catch {
    return null
  }
}

export function usePublicOrderTracking(restaurantSlug: string, tableCode: string) {
  const lastOrder = loadPublicLastOrder(restaurantSlug, tableCode)

  const query = useQuery({
    queryKey: ['public-order-tracking', restaurantSlug, tableCode, lastOrder?.orderId ?? 'none'],
    queryFn: () =>
      publicOrderTrackingService.getPublicOrderTracking(
        restaurantSlug,
        tableCode,
        lastOrder!.orderId,
      ),
    enabled: Boolean(lastOrder?.orderId),
    refetchInterval: (q) => {
      const status = (q.state.data as PublicOrderTrackingResult | undefined)?.status
      if (status === 'DELIVERED' || status === 'CANCELLED') return false
      return 15_000
    },
  })

  useEffect(() => {
    if (!query.data || !lastOrder) return
    savePublicLastOrder({
      ...lastOrder,
      status: query.data.status,
      createdAt: query.data.createdAt,
    })
  }, [lastOrder, query.data])

  return {
    ...query,
    lastOrder,
  }
}
