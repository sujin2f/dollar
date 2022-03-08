import { Category, CreateItemsParam, Item } from './model'
import { Nullable } from './common'

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
    categories: Category[]
    menuOpen: boolean
    dateFormat: string
    rawText: string
    preItemsDataset: CreateItemsParam[]
    deleteItemModal: Nullable<string>
}

export type StatePreItems = {
    dateFormat: string
    rawText: string
    preItemsDataset: CreateItemsParam[]
}

export type State = {
    categories: WithApiState<Category[]>
    items: WithApiState<Item[]>
    option: {
        menuOpen: boolean
        preItems: StatePreItems
        deleteItemModal?: string
        apolloCache: number
    }
}

export const initialState: State = {
    categories: ApiState.NotAssigned,
    items: ApiState.NotAssigned,
    option: {
        menuOpen: false,
        preItems: {
            dateFormat: '',
            rawText: '',
            preItemsDataset: [],
        },
        apolloCache: new Date().getTime(),
    },
}

export const isApiState = (state: unknown): boolean => {
    return typeof state === 'number'
}
