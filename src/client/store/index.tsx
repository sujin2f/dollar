import React, { createContext, PropsWithChildren, useReducer } from 'react'
import { initialState, State } from 'src/types/store'
import { reducer } from './reducer'

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

export { setMenuOpen } from './actions'
