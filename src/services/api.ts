import axios from 'axios'

import { authStorage } from '@/features/auth/auth.storage'
import { env } from '@/lib/env'

export const api = axios.create({
  baseURL: env.apiUrl,
})

api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear()
    }
    return Promise.reject(error)
  },
)
