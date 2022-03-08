import { Action } from 'src/types/store'
import { SET_MENU_OPEN } from './type'

export const setMenuOpen = (menuOpen: boolean): Partial<Action> => {
    return {
        type: SET_MENU_OPEN,
        menuOpen,
    }
}
