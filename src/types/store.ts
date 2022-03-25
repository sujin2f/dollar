import { Nullable } from './common'
import { Category, Item } from './model'

export type Action = {
    type: string
    item: Item
    message: string
    timeout: NodeJS.Timeout
    bool: boolean
    category: Category
}

export type State = {
    menuOpen: boolean
    modal: {
        deleteItemOpened: Nullable<Item>
        updateItemOpened: Nullable<Item>
        addItemOpened: boolean
        categorySelectorOpened: boolean
        categoryEditorOpened: Nullable<Category>
    }
    callout: {
        message: Nullable<string>
        timeout: Nullable<NodeJS.Timeout>
    }
}

export const initialState: State = {
    menuOpen: false,
    modal: {
        deleteItemOpened: undefined,
        updateItemOpened: undefined,
        addItemOpened: false,
        categorySelectorOpened: false,
        categoryEditorOpened: undefined,
    },
    callout: {
        message: undefined,
        timeout: undefined,
    },
}
