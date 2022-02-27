import { Action, Item, User } from 'src/types'

export const GET_ITEMS_SUCCESS = 'sujin/v1/GET_ITEMS_SUCCESS'
export const OPEN_DELETE_POPUP = 'sujin/v1/OPEN_DELETE_POPUP'
export const CLOSE_DELETE_POPUP = 'sujin/v1/CLOSE_DELETE_POPUP'
export const SET_USER = 'sujin/v1/SET_USER'
export const UNSET_USER = 'sujin/v1/UNSET_USER'
export const SOCKET_USER_READY = 'sujin/v1/SOCKET_USER_READY'
export const SOCKET_ITEMS_READY = 'sujin/v1/SOCKET_ITEMS_READY'

/**
 * Get items success
 * @param {Item[]} items
 * @returns {Partial<Action>}
 */
export const getItemsSuccess = (items: Item[]): Partial<Action> => {
    return {
        type: GET_ITEMS_SUCCESS,
        items,
    }
}

/**
 * Open Popup
 * @returns {Partial<Action>}
 */
export const openRemovePopup = (_id: string): Partial<Action> => {
    return {
        type: OPEN_DELETE_POPUP,
        _id,
    }
}

/**
 * Close Popup
 * @returns {Partial<Action>}
 */
export const closeRemovePopup = (): Partial<Action> => {
    return {
        type: CLOSE_DELETE_POPUP,
    }
}

/**
 * Login
 * @returns {Partial<Action>}
 */
export const setUser = (user: User): Partial<Action> => {
    return {
        type: SET_USER,
        user,
    }
}

/**
 * Logout
 * @returns {Partial<Action>}
 */
export const unsetUser = (): Partial<Action> => {
    return {
        type: UNSET_USER,
    }
}

export const socketUserReady = (): Partial<Action> => {
    return {
        type: SOCKET_USER_READY,
    }
}

export const socketItemsReady = (): Partial<Action> => {
    return {
        type: SOCKET_ITEMS_READY,
    }
}
