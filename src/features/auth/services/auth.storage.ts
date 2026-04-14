import type { AuthUser } from '@/features/auth/types/auth.types'

const TOKEN_KEY = 'restaurant_saas_token'
const USER_KEY = 'restaurant_saas_user'

export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const setStoredToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const setStoredUser = (user: AuthUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY)
}

export const clearStoredSession = () => {
  removeStoredToken()
  removeStoredUser()
}
