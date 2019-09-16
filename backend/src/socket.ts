import * as Socket from 'socket.io'
import * as http from 'http'

let io: Socket.Server | null = null

export function socketInit(server: http.Server): Socket.Server {
  io = Socket(server)
  return io
}

export function getSocketIO(): Socket.Server {
  if (!io) {
    throw new Error('Socket.io is null.')
  }
  return io
}
