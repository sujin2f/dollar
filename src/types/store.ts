import { Category, Item, User } from '.'

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
}

export type State = {
    user: WithApiState<User>
    categories: WithApiState<Category[]>
    items: WithApiState<Item[]>
    option: {
        menuOpen: boolean
    }
}

export const initialState: State = {
    user: ApiState.NotAssigned,
    categories: ApiState.NotAssigned,
    items: ApiState.NotAssigned,
    option: {
        menuOpen: false,
    },
}

export const isApiState = (state: unknown): boolean => {
    return typeof state === 'number'
}
