import { useContext, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import {
    ContextType,
    Context,
    socketItemsReady,
    getItemsSuccess,
} from 'src/client/store'
import { Item } from 'src/types'
import { SocketEvent } from 'src/constants/socket'

export const useItems = (): Item[] => {
    const [
        {
            items,
            socketReady: { items: socketReady },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    useEffect(() => {
        if (socketReady) {
            return
        }

        const socket = socketIOClient('/')
        socket.emit(SocketEvent.GET_ITEMS)
        socket.on(SocketEvent.GET_ITEMS, (response: Item[]) => {
            dispatch(getItemsSuccess(response))
        })

        dispatch(socketItemsReady())
    }, [dispatch, socketReady])

    return items
}
