export type Action = {
    _id: string
    type: string
    menuOpen: boolean
}

export type State = {
    menuOpen: boolean
}

export const initialState: State = {
    menuOpen: false,
}
