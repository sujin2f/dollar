import { State, initialState, Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    CLOSE_MODAL,
} from './type'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case SET_MENU_OPEN: {
            return {
                ...state,
                updateModal: action.item,
            }
        }

        case SET_DELETE_MODAL: {
            return {
                ...state,
                deleteModal: action.item,
            }
        }

        case SET_UPDATE_MODAL: {
            return {
                ...state,
                updateModal: action.item,
            }
        }

        case CLOSE_MODAL: {
            return {
                ...state,
                deleteModal: undefined,
                updateModal: undefined,
            }
        }

        default: {
            return state
        }
    }
}
