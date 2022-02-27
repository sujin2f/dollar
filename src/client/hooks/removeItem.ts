import socketIOClient from 'socket.io-client'
import { SocketEvent } from 'src/constants/socket'

export const removeItem = (id: string) => {
    const socket = socketIOClient('/')
    socket.emit(SocketEvent.REMOVE_ITEM, id)
}
