import socketIOClient from 'socket.io-client'
import { SocketEvent } from 'src/constants/socket'

export const setDarkMode = (darkMode: boolean) => {
    const socket = socketIOClient('/')
    socket.emit(SocketEvent.SET_DARK_MODE, darkMode)
}
