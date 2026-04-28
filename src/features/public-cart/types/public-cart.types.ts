export interface AddToCartProduct {
  productId: string
  name: string
  price: number
  imageUrl?: string | null
}

export interface PublicCartItem {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
  notes?: string
}

export interface PublicCartState {
  items: PublicCartItem[]
}
