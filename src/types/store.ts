import { Nullable } from './common'
import { Item } from './model'

export type Action = {
    type: string
    item: Item
    message: string
    timeout: NodeJS.Timeout
    bool: boolean
}

export type State = {
    menuOpen: boolean
    modal: {
        deleteItem: Nullable<Item>
        updateItem: Nullable<Item>
        addItem: boolean
        categorySelector: boolean
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
        addItem: false,
        categorySelector: false,
    },
    callout: {
        message: undefined,
        timeout: undefined,
    },
}
