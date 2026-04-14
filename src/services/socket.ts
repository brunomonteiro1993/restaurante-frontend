import { io, type Socket } from 'socket.io-client'

import { authStorage } from '@/features/auth/auth.storage'
import { env } from '@/lib/env'

let socket: Socket | null = null

export const socketService = {
  connect: () => {
    const token = authStorage.getToken()
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
