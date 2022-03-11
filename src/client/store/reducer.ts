import { State, initialState, Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    CLOSE_MODAL,
    SET_CALLOUT,
} from './type'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case SET_MENU_OPEN: {
            return {
                ...state,
                menuOpen: action.menuOpen,
            }
        }

        case SET_DELETE_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    deleteItem: action.item,
                },
            }
        }

        case SET_UPDATE_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    updateItem: action.item,
                },
            }
        }

        case CLOSE_MODAL: {
            return {
                ...state,
                modal: {
                    updateItem: undefined,
                    deleteItem: undefined,
                },
            }
        }

        case SET_CALLOUT: {
            return {
                ...state,
                callout: {
                    message: action.message,
                    timeout: action.timeout,
                },
            }
        }

        default: {
            return state
        }
    }
}
