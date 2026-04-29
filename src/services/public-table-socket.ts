import { io, type Socket } from 'socket.io-client'

import { env } from '@/lib/env'

let socket: Socket | null = null
let boundSlug: string | null = null
let boundCode: string | null = null

/**
 * Socket.IO só para cardápio público da mesa (sem JWT).
 * Handshake: `auth.publicTable` validado no servidor; entra na room `table:{id}`.
 */
export const publicTableSocketService = {
  connect(restaurantSlug: string, tableCode: string): Socket | null {
    if (socket?.connected && boundSlug === restaurantSlug && boundCode === tableCode) {
      return socket
    }

    publicTableSocketService.disconnect()

    boundSlug = restaurantSlug
    boundCode = tableCode

    socket = io(env.socketUrl, {
      auth: {
        publicTable: { restaurantSlug, tableCode },
      },
      transports: ['websocket'],
    })

    return socket
  },

  disconnect(): void {
    socket?.disconnect()
    socket = null
    boundSlug = null
    boundCode = null
  },

  getInstance: (): Socket | null => socket,
}
