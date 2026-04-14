import { io, type Socket } from 'socket.io-client'

import { getStoredToken } from '@/features/auth/services/auth.storage'
import { env } from '@/lib/env'

let socket: Socket | null = null

export const socketService = {
  connect: () => {
    const token = getStoredToken()
    if (!token || socket?.connected) return socket

    socket = io(env.socketUrl, {
      auth: { token },
      transports: ['websocket'],
    })

    return socket
  },
  disconnect: () => {
    socket?.disconnect()
    socket = null
  },
  getInstance: () => socket,
}
