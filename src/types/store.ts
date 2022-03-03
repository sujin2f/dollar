import { Category, CreateItemsParam, Item, User } from '.'

export enum ApiState {
    NotAssigned,
    Loading,
    Removed,
}

export type WithApiState<T> = ApiState | T

export type Action = {
    type: string
    items: Item[]
    _id: string
    user: User
    categories: Category[]
    menuOpen: boolean
    dateFormat: string
    rawText: string
    preItemsDataset: CreateItemsParam[]
}

export type StatePreItems = {
    dateFormat: string
    rawText: string
    preItemsDataset: CreateItemsParam[]
}

export type State = {
    user: WithApiState<User>
    categories: WithApiState<Category[]>
    items: WithApiState<Item[]>
    option: {
        menuOpen: boolean
        preItems: StatePreItems
    }
}

export const initialState: State = {
    user: ApiState.NotAssigned,
    categories: ApiState.NotAssigned,
    items: ApiState.NotAssigned,
    option: {
        menuOpen: false,
        preItems: {
            dateFormat: '',
            rawText: '',
            preItemsDataset: [],
        },
    },
}

export const isApiState = (state: unknown): boolean => {
    return typeof state === 'number'
}
