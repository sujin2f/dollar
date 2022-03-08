import { useContext } from 'react'

import {
    ContextType,
    Context,
    setMenuOpen as setStoreMenuOpen,
} from 'src/client/store'

export const useGlobalOption = () => {
    const [{ menuOpen }, dispatch] = useContext(Context) as ContextType

    const setMenuOpen = (option: boolean) => {
        dispatch(setStoreMenuOpen(option))
    }

    return {
        menuOpen,
        setMenuOpen,
    }
}
