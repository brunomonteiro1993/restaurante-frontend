export type UserRole = 'ADMIN' | 'MANAGER' | 'WAITER' | 'KITCHEN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  restaurantId: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  message: string
}
