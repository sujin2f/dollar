import { useContext } from 'react'

import {
    ContextType,
    Context,
    setMenuOpen as setStoreMenuOpen,
    setDeleteItemModal as setStoreDeleteItemModal,
    resetApolloCache as resetStoreApolloCache,
} from 'src/client/store'

export const useGlobalOption = () => {
    const [
        {
            option: { menuOpen, deleteItemModal, preItems, apolloCache },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    const setMenuOpen = (option: boolean) => {
        dispatch(setStoreMenuOpen(option))
    }

    const setDeleteItemModal = (option?: string) => {
        dispatch(setStoreDeleteItemModal(option))
    }

    const resetApolloCache = () => {
        dispatch(resetStoreApolloCache())
    }

    return {
        menuOpen,
        deleteItemModal,
        preItems,
        apolloCache,
        setMenuOpen,
        setDeleteItemModal,
        resetApolloCache,
    }
}
