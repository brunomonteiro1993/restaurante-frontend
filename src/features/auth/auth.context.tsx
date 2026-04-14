import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { authService } from '@/features/auth/services/auth.service'
import type { AuthUser, LoginInput } from '@/features/auth/types/auth.types'
import { socketService } from '@/services/socket'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authService.getStoredUser())
  const [token, setToken] = useState<string | null>(authService.getStoredToken())
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    authService.clearSession()
    setToken(null)
    setUser(null)
    socketService.disconnect()
  }, [])

  useEffect(() => {
    if (token) socketService.connect()
    else socketService.disconnect()
  }, [token])

  useEffect(() => {
    authService.setUnauthorizedHandler(() => {
      clearSession()
    })

    return () => {
      authService.setUnauthorizedHandler(undefined)
    }
  }, [clearSession])

  useEffect(() => {
    const bootstrapSession = async () => {
      const storedToken = authService.getStoredToken()
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await authService.getMe()
        setToken(storedToken)
        setUser(profile)
      } catch {
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    void bootstrapSession()
  }, [clearSession])

  const login = async (input: LoginInput) => {
    const session = await authService.login(input)
    authService.persistSession(session)

    setToken(session.token)
    setUser(session.user)

    const profile = await authService.getMe()
    setUser(profile)
  }

  const logout = () => {
    clearSession()
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [isLoading, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
