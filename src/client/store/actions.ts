import { Category, Item } from 'src/types/model'
import { Action } from 'src/types/store'
import {
    SET_MENU_OPEN,
    SET_DELETE_MODAL,
    SET_UPDATE_MODAL,
    SET_ADD_MODAL,
    CLOSE_MODAL,
    SET_CALLOUT,
    SET_CATEGORY_SELECTOR,
    SET_CATEGORY_EDITOR,
} from './type'

export const setMenuOpen = (bool: boolean): Partial<Action> => {
    return {
        type: SET_MENU_OPEN,
        bool,
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

export const setAddModal = (bool: boolean): Partial<Action> => {
    return {
        type: SET_ADD_MODAL,
        bool,
    }
}

export const setCategorySelector = (bool: boolean): Partial<Action> => {
    return {
        type: SET_CATEGORY_SELECTOR,
        bool,
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

export const setCategoryEditor = (category: Category): Partial<Action> => {
    return {
        type: SET_CATEGORY_EDITOR,
        category,
    }
}
