import { State, initialState, Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    CLOSE_MODAL,
    SET_CALLOUT,
    SET_ADD_MODAL,
    SET_CATEGORY_SELECTOR,
    SET_CATEGORY_EDITOR,
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
                    deleteItemOpened: action.item,
                },
            }
        }

        case SET_UPDATE_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    updateItemOpened: action.item,
                },
            }
        }

        case SET_ADD_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    addItemOpened: action.bool,
                },
            }
        }

        case CLOSE_MODAL: {
            return {
                ...state,
                menuOpen: false,
                modal: initialState.modal,
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
                    categorySelectorOpened: action.bool,
                },
            }
        }

        case SET_CATEGORY_EDITOR: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    categoryEditorOpened: action.category,
                },
            }
        }

        /* istanbul ignore next */
        default: {
            return state
        }
    }
}
