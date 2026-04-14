import { api, setUnauthorizedHandler } from '@/services/api'
import type {
  ApiSuccessResponse,
  AuthUser,
  LoginInput,
  LoginResponse,
} from '@/features/auth/types/auth.types'
import {
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  removeStoredToken,
  setStoredToken,
  setStoredUser,
} from '@/features/auth/services/auth.storage'

export const authService = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const { data } = await api.post<ApiSuccessResponse<LoginResponse>>('/auth/login', input)
    return data.data
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await api.get<ApiSuccessResponse<AuthUser>>('/me')
    return data.data
  },

  persistSession(session: LoginResponse) {
    setStoredToken(session.token)
    setStoredUser(session.user)
  },

  clearSession() {
    clearStoredSession()
  },

  getStoredToken,
  getStoredUser,
  removeStoredToken,
  setUnauthorizedHandler,
}
