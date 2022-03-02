import { Action, State, ApiState, initialState } from 'src/types'
import {
    GET_USER_INIT,
    GET_USER_SUCCESS,
    GET_USER_FAILED,
    GET_ITEMS_INIT,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_FAILED,
    GET_CATEGORIES_INIT,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILED,
    SET_MENU_OPEN,
} from './type'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case GET_ITEMS_INIT: {
            return {
                ...state,
                items: ApiState.Loading,
            }
        }

        case GET_ITEMS_SUCCESS: {
            return {
                ...state,
                items: action.items,
            }
        }

        case GET_ITEMS_FAILED: {
            return {
                ...state,
                items: ApiState.Removed,
            }
        }

        case GET_USER_INIT: {
            return {
                ...state,
                user: ApiState.Loading,
            }
        }

        case GET_USER_SUCCESS: {
            return {
                ...state,
                user: action.user,
            }
        }

        case GET_USER_FAILED: {
            return {
                ...state,
                user: ApiState.Removed,
            }
        }

        case GET_CATEGORIES_INIT: {
            return {
                ...state,
                categories: ApiState.Loading,
            }
        }

        case GET_CATEGORIES_SUCCESS: {
            return {
                ...state,
                categories: action.categories,
            }
        }

        case GET_CATEGORIES_FAILED: {
            return {
                ...state,
                categories: ApiState.Removed,
            }
        }

        case SET_MENU_OPEN: {
            return {
                ...state,
                option: {
                    ...state.option,
                    menuOpen: action.menuOpen,
                },
            }
        }

        default: {
            return state
        }
    }
}
