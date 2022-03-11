import { Item } from 'src/types/model'
import { Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    CLOSE_MODAL,
    SET_CALLOUT,
} from './type'

export const setMenuOpen = (menuOpen: boolean): Partial<Action> => {
    return {
        type: SET_MENU_OPEN,
        menuOpen,
    }
}

export const setDeleteModal = (item: Item): Partial<Action> => {
    return {
        type: SET_DELETE_MODAL,
        item,
    }
}

export const setUpdateModal = (item: Item): Partial<Action> => {
    return {
        type: SET_UPDATE_MODAL,
        item,
    }
}

export const closeModal = (): Partial<Action> => {
    return {
        type: CLOSE_MODAL,
    }
}

export const setCallOut = (message?: string, timeout?: NodeJS.Timeout) => {
    return {
        type: SET_CALLOUT,
        message,
        timeout,
    }
}
