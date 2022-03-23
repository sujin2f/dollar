import { State, initialState, Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    CLOSE_MODAL,
    SET_CALLOUT,
    SET_ADD_MODAL,
    SET_CATEGORY_SELECTOR,
} from './type'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case SET_MENU_OPEN: {
            return {
                ...state,
                menuOpen: action.bool,
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
                    addItem: action.bool,
                },
            }
        }

        case CLOSE_MODAL: {
            return {
                ...state,
                menuOpen: false,
                modal: {
                    updateItem: undefined,
                    deleteItem: undefined,
                    addItem: false,
                    categorySelector: false,
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

        case SET_CATEGORY_SELECTOR: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    categorySelector: action.bool,
                },
            }
        }

        /* istanbul ignore next */
        default: {
            return state
        }
    }
}
