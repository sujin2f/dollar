import { useContext, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import {
    ContextType,
    Context,
    setUser,
    unsetUser,
    socketUserReady,
} from 'src/client/store'
import { Nullable, User } from 'src/types'
import { SocketEvent } from 'src/constants/socket'

export const useUser = (): Nullable<User> => {
    const [
        {
            user,
            socketReady: { user: socketReady },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    useEffect(() => {
        if (socketReady) {
            return
        }

        const socket = socketIOClient('/')
        socket.emit(SocketEvent.GET_USER)
        socket.on(SocketEvent.GET_USER, (response: Nullable<User>) => {
            if (response) {
                dispatch(setUser(response))
                return
            }
            dispatch(unsetUser())
        })

        dispatch(socketUserReady())
    }, [dispatch, socketReady])

    return user
}
