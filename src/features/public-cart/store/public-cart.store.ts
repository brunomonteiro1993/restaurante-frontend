import type {
  AddToCartProduct,
  PublicCartItem,
  PublicCartState,
} from '@/features/public-cart/types/public-cart.types'

const MAX_ITEM_QUANTITY = 50

export function getPublicCartStorageKey(restaurantSlug: string, tableCode: string): string {
  return `public-cart:${restaurantSlug}:${tableCode}`
}

export function getEmptyPublicCartState(): PublicCartState {
  return { items: [] }
}

export function loadPublicCartState(storageKey: string): PublicCartState {
  if (typeof window === 'undefined') return getEmptyPublicCartState()

  const raw = window.localStorage.getItem(storageKey)
  if (!raw) return getEmptyPublicCartState()

  try {
    const parsed = JSON.parse(raw) as Partial<PublicCartState>
    if (!parsed || !Array.isArray(parsed.items)) return getEmptyPublicCartState()

    const items = parsed.items
      .filter((item): item is PublicCartItem => Boolean(item?.productId && item?.name))
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.min(MAX_ITEM_QUANTITY, Number(item.quantity) || 1)),
        price: Number(item.price) || 0,
        imageUrl: item.imageUrl ?? null,
      }))

    return { items }
  } catch {
    return getEmptyPublicCartState()
  }
}

export function savePublicCartState(storageKey: string, state: PublicCartState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

export function addProductToCart(state: PublicCartState, product: AddToCartProduct): PublicCartState {
  const existingIndex = state.items.findIndex((item) => item.productId === product.productId)
  if (existingIndex === -1) {
    return {
      items: [
        ...state.items,
        {
          productId: product.productId,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl ?? null,
          quantity: 1,
          notes: '',
        },
      ],
    }
  }

  const items = [...state.items]
  const current = items[existingIndex]
  items[existingIndex] = {
    ...current,
    quantity: Math.min(MAX_ITEM_QUANTITY, current.quantity + 1),
  }
  return { items }
}

export function incrementCartItem(state: PublicCartState, productId: string): PublicCartState {
  return {
    items: state.items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.min(MAX_ITEM_QUANTITY, item.quantity + 1) }
        : item,
    ),
  }
}

export function decrementCartItem(state: PublicCartState, productId: string): PublicCartState {
  const target = state.items.find((item) => item.productId === productId)
  if (!target) return state
  if (target.quantity <= 1) return removeCartItem(state, productId)

  return {
    items: state.items.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
    ),
  }
}

export function removeCartItem(state: PublicCartState, productId: string): PublicCartState {
  return {
    items: state.items.filter((item) => item.productId !== productId),
  }
}

export function setCartItemNotes(
  state: PublicCartState,
  productId: string,
  notes: string,
): PublicCartState {
  return {
    items: state.items.map((item) =>
      item.productId === productId ? { ...item, notes: notes.trim() } : item,
    ),
  }
}

export function clearCart(): PublicCartState {
  return getEmptyPublicCartState()
}

export function getCartItemsCount(state: PublicCartState): number {
  return state.items.reduce((acc, item) => acc + item.quantity, 0)
}

export function getCartSubtotal(state: PublicCartState): number {
  return state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}
