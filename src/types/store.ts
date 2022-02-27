import { Item, User } from '.'

export type State = {
    user?: User
    items: Item[]
    removePopup: string | false
    socketReady: {
        user: boolean
        items: boolean
    }
}

export type Action = {
    type: string
    items: Item[]
    _id: string
    user: User
}
