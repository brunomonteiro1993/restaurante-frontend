import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { authStorage } from '@/features/auth/auth.storage'
import { api } from '@/services/api'
import { socketService } from '@/services/socket'
import type { User } from '@/types/domain.types'

interface LoginInput {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  user: User
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authStorage.getUser())
  const [token, setToken] = useState<string | null>(authStorage.getToken())

  useEffect(() => {
    if (token) socketService.connect()
    else socketService.disconnect()
  }, [token])

  const login = async (input: LoginInput) => {
    const { data } = await api.post<LoginResponse>('/auth/login', input)
    authStorage.setToken(data.accessToken)
    authStorage.setUser(data.user)
    setToken(data.accessToken)
    setUser(data.user)
  }

  const logout = () => {
    authStorage.clear()
    setToken(null)
    setUser(null)
    socketService.disconnect()
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
