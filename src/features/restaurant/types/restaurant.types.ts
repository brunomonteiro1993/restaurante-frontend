export interface RestaurantProfile {
  id: string
  name: string
  slug: string
  phone: string | null
  email: string | null
  logoUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
