import { Nullable } from './common'
import { Item } from './model'

export type Action = {
    type: string
    menuOpen: boolean
    item: Item
    message: string
    timeout: NodeJS.Timeout
}

export type State = {
    menuOpen: boolean
    modal: {
        deleteItem: Nullable<Item>
        updateItem: Nullable<Item>
    }
    callout: {
        message: Nullable<string>
        timeout: Nullable<NodeJS.Timeout>
    }
}

export const initialState: State = {
    menuOpen: false,
    modal: {
        deleteItem: undefined,
        updateItem: undefined,
    },
    callout: {
        message: undefined,
        timeout: undefined,
    },
}
