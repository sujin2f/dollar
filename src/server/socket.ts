import { Socket } from 'socket.io'
import { Request } from 'express'
import { SocketEvent } from 'src/constants/socket'
import {
    getItems,
    getUserById,
    createItem,
    removeItem,
    setDarkMode,
} from 'src/utils'

export const socketListener = (socket: Socket) => {
    const session = (socket.request as Request).session
    const user = (session.user || 'public').toString()
    socket.join(user)

    /**
     * Get User
     */
    socket.on(SocketEvent.GET_USER, async () => {
        if (user === 'public') {
            socket.emit(SocketEvent.GET_USER, undefined)
            return
        }
        const mongoUser = await getUserById(user)
        socket.emit(SocketEvent.GET_USER, mongoUser)
    })

    /**
     * Get Items
     */
    socket.on(SocketEvent.GET_ITEMS, async () => {
        const mongoUser = user === 'public' ? undefined : user
        const items = await getItems(mongoUser)

        socket.emit(SocketEvent.GET_ITEMS, items)
        socket.to(user).emit(SocketEvent.GET_ITEMS, items)
    })

    /**
     * Create Item
     */
    socket.on(
        SocketEvent.CREATE_ITEM,
        async (title: string, expiration: string) => {
            const mongoUser = user === 'public' ? undefined : user
            await createItem(title, expiration, mongoUser)
            const items = await getItems(mongoUser)

            socket.emit(SocketEvent.GET_ITEMS, items)
            socket.to(user).emit(SocketEvent.GET_ITEMS, items)
        },
    )

    /**
     * Remove Item
     */
    socket.on(SocketEvent.REMOVE_ITEM, async (id: string) => {
        const mongoUser = user === 'public' ? undefined : user
        await removeItem(id, mongoUser)
        const items = await getItems(mongoUser)

        socket.emit(SocketEvent.GET_ITEMS, items)
        socket.broadcast.to(user).emit(SocketEvent.GET_ITEMS, items)
    })

    /**
     * Dark Mode
     */
    socket.on(SocketEvent.SET_DARK_MODE, async (darkMode: boolean) => {
        if (user === 'public') {
            return
        }
        await setDarkMode(user, darkMode)
        const mongoUser = await getUserById(user)

        socket.emit(SocketEvent.GET_USER, mongoUser)
        socket.broadcast.to(user).emit(SocketEvent.GET_USER, mongoUser)
    })
}
