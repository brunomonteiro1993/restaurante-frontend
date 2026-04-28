import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import type { AddToCartProduct, PublicCartState } from '@/features/public-cart/types/public-cart.types'
import {
  addProductToCart,
  clearCart,
  decrementCartItem,
  getCartItemsCount,
  getCartSubtotal,
  getEmptyPublicCartState,
  getPublicCartStorageKey,
  incrementCartItem,
  loadPublicCartState,
  removeCartItem,
  savePublicCartState,
  setCartItemNotes,
} from '@/features/public-cart/store/public-cart.store'

interface PublicCartContextValue {
  state: PublicCartState
  itemsCount: number
  subtotal: number
  addItem: (product: AddToCartProduct) => void
  incrementItem: (productId: string) => void
  decrementItem: (productId: string) => void
  removeItem: (productId: string) => void
  setItemNotes: (productId: string, notes: string) => void
  clear: () => void
}

const PublicCartContext = createContext<PublicCartContextValue | null>(null)

interface PublicCartProviderProps {
  restaurantSlug: string
  tableCode: string
  children: ReactNode
}

export function PublicCartProvider({ restaurantSlug, tableCode, children }: PublicCartProviderProps) {
  const storageKey = useMemo(
    () => getPublicCartStorageKey(restaurantSlug, tableCode),
    [restaurantSlug, tableCode],
  )
  const [state, setState] = useState<PublicCartState>(() => loadPublicCartState(storageKey))

  useEffect(() => {
    setState(loadPublicCartState(storageKey))
  }, [storageKey])

  useEffect(() => {
    savePublicCartState(storageKey, state)
  }, [storageKey, state])

  const value = useMemo<PublicCartContextValue>(
    () => ({
      state,
      itemsCount: getCartItemsCount(state),
      subtotal: getCartSubtotal(state),
      addItem: (product) => {
        setState((prev) => addProductToCart(prev, product))
        toast.success(`${product.name} adicionado ao carrinho.`)
      },
      incrementItem: (productId) => setState((prev) => incrementCartItem(prev, productId)),
      decrementItem: (productId) => setState((prev) => decrementCartItem(prev, productId)),
      removeItem: (productId) => setState((prev) => removeCartItem(prev, productId)),
      setItemNotes: (productId, notes) => setState((prev) => setCartItemNotes(prev, productId, notes)),
      clear: () => setState(clearCart()),
    }),
    [state],
  )

  return <PublicCartContext.Provider value={value}>{children}</PublicCartContext.Provider>
}

export function usePublicCart() {
  const ctx = useContext(PublicCartContext)
  if (!ctx) {
    throw new Error('usePublicCart must be used inside PublicCartProvider.')
  }
  return ctx
}

export function usePublicCartOptional() {
  return useContext(PublicCartContext) ?? {
    state: getEmptyPublicCartState(),
    itemsCount: 0,
    subtotal: 0,
    addItem: (_product: AddToCartProduct) => {},
    incrementItem: (_productId: string) => {},
    decrementItem: (_productId: string) => {},
    removeItem: (_productId: string) => {},
    setItemNotes: (_productId: string, _notes: string) => {},
    clear: () => {},
  }
}
