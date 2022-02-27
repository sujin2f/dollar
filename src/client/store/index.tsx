import React, { createContext, useReducer } from 'react'
import { reducer, initialState } from 'src/client/store/reducer'
import type { ReactChildrenProps, State } from 'src/types'

export const Context = createContext([initialState, null])
export type ContextType = [State, any]

export const Store = ({ children }: ReactChildrenProps): React.ReactElement => {
    const [state, dispatch]: ContextType = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export {
    getItemsSuccess,
    closeRemovePopup,
    openRemovePopup,
    setUser,
    unsetUser,
    socketUserReady,
    socketItemsReady,
} from './actions'
