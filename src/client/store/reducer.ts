import {
    OPEN_DELETE_POPUP,
    CLOSE_DELETE_POPUP,
    SOCKET_USER_READY,
    SET_USER,
    UNSET_USER,
    SOCKET_ITEMS_READY,
    GET_ITEMS_SUCCESS,
} from 'src/client/store/actions'
import { Action, State } from 'src/types'

export const initialState: State = {
    user: undefined,
    items: [],
    removePopup: false,
    socketReady: {
        user: false,
        items: false,
    },
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case GET_ITEMS_SUCCESS: {
            return {
                ...state,
                items: action.items,
            }
        }

        case OPEN_DELETE_POPUP: {
            return {
                ...state,
                removePopup: action._id,
            }
        }

        case CLOSE_DELETE_POPUP: {
            return {
                ...state,
                removePopup: false,
            }
        }

        case SET_USER: {
            return {
                ...state,
                user: action.user,
            }
        }

        case UNSET_USER: {
            return {
                ...state,
                user: undefined,
            }
        }

        case SOCKET_USER_READY: {
            return {
                ...state,
                socketReady: {
                    ...state.socketReady,
                    user: true,
                },
            }
        }

        case SOCKET_ITEMS_READY: {
            return {
                ...state,
                socketReady: {
                    ...state.socketReady,
                    items: true,
                },
            }
        }

        default: {
            return state
        }
    }
}
