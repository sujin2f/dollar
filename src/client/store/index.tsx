import React, { createContext, PropsWithChildren, useReducer } from 'react'
import { reducer } from './reducer'
import type { State } from 'src/types'
import { initialState } from 'src/types'

export const Context = createContext([initialState, null])
export type ContextType = [State, any]

export const Store = ({
    children,
}: PropsWithChildren<{}>): React.ReactElement => {
    const [state, dispatch]: ContextType = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export {
    getItemsInit,
    getItemsSuccess,
    getItemsFailed,
    getCategoriesInit,
    getCategoriesSuccess,
    getCategoriesFailed,
    getUserInit,
    getUserSuccess,
    getUserFailed,
    setMenuOpen,
} from './actions'
