import io from 'socket.io-client'

const socketIO: SocketIOClient.Socket = io(process.env.VUE_APP_SERVER_API)

export default socketIO
