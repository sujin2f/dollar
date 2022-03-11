import { State, initialState, Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    CLOSE_MODAL,
    SET_CALLOUT,
    SET_ADD_MODAL,
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

        case SET_ADD_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    addItem: action.addItem,
                },
            }
        }

        case CLOSE_MODAL: {
            return {
                ...state,
                modal: {
                    updateItem: undefined,
                    deleteItem: undefined,
                    addItem: false,
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
