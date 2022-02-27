import socketIOClient from 'socket.io-client'
import { SocketEvent } from 'src/constants/socket'

export const createItem = (title: string, expiration: string) => {
    const socket = socketIOClient('/')
    socket.emit(SocketEvent.CREATE_ITEM, title, expiration)
}
