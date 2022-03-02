import { Action, Category, Item, User } from 'src/types'
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

export const getItemsInit = (): Partial<Action> => {
    return {
        type: GET_ITEMS_INIT,
    }
}

export const getItemsSuccess = (items: Item[]): Partial<Action> => {
    return {
        type: GET_ITEMS_SUCCESS,
        items,
    }
}

export const getItemsFailed = (): Partial<Action> => {
    return {
        type: GET_ITEMS_FAILED,
    }
}

export const getUserInit = (): Partial<Action> => {
    return {
        type: GET_USER_INIT,
    }
}

export const getUserSuccess = (user: User): Partial<Action> => {
    return {
        type: GET_USER_SUCCESS,
        user,
    }
}

export const getUserFailed = (): Partial<Action> => {
    return {
        type: GET_USER_FAILED,
    }
}

export const getCategoriesInit = (): Partial<Action> => {
    return {
        type: GET_CATEGORIES_INIT,
    }
}

export const getCategoriesSuccess = (
    categories: Category[],
): Partial<Action> => {
    return {
        type: GET_CATEGORIES_SUCCESS,
        categories,
    }
}

export const getCategoriesFailed = (): Partial<Action> => {
    return {
        type: GET_CATEGORIES_FAILED,
    }
}

export const setMenuOpen = (menuOpen: boolean): Partial<Action> => {
    return {
        type: SET_MENU_OPEN,
        menuOpen,
    }
}
