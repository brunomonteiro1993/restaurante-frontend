import axios from 'axios'

import { getStoredToken } from '@/features/auth/services/auth.storage'
import { env } from '@/lib/env'

export const api = axios.create({
  baseURL: env.apiUrl,
})

let unauthorizedHandler: (() => void) | undefined

export const setUnauthorizedHandler = (handler?: () => void) => {
  unauthorizedHandler = handler
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)
