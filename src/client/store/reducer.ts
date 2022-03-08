import { State, initialState, Action } from 'src/types/store'
import { SET_MENU_OPEN } from './type'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case SET_MENU_OPEN: {
            return {
                ...state,
                menuOpen: action.menuOpen,
            }
        }

        default: {
            return state
        }
    }
}
