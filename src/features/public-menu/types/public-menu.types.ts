export interface PublicMenuRestaurant {
  name: string
  slug: string
  logoUrl: string | null
  description: string | null
}

export interface PublicMenuTable {
  number: string
  publicCode: string
}

export interface PublicMenuProduct {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
}

export interface PublicMenuCategory {
  id: string
  name: string
  products: PublicMenuProduct[]
}

export interface PublicMenuResult {
  restaurant: PublicMenuRestaurant
  table: PublicMenuTable | null
  categories: PublicMenuCategory[]
}
