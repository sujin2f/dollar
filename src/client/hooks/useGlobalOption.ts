import { useContext } from 'react'

import {
    ContextType,
    Context,
    setMenuOpen as setStoreMenuOpen,
} from 'src/client/store'
import { Fn } from 'src/types'

type SetMenuOpen = Fn<[boolean], void>

export const useMenuOpen = (): [boolean, SetMenuOpen] => {
    const [
        {
            option: { menuOpen },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    const setMenuOpen = (option: boolean) => {
        dispatch(setStoreMenuOpen(option))
    }

    return [menuOpen, setMenuOpen]
}
