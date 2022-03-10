import { Nullable } from './common'
import { Item } from './model'

export type Action = {
    type: string
    menuOpen: boolean
    item: Item
}

export type State = {
    menuOpen: boolean
    deleteModal: Nullable<Item>
    updateModal: Nullable<Item>
}

export const initialState: State = {
    menuOpen: false,
    deleteModal: undefined,
    updateModal: undefined,
}
