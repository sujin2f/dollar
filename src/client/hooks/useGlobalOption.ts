import { useContext } from 'react'

import {
    ContextType,
    Context,
    setMenuOpen as setStoreMenuOpen,
    setDeleteItemModal as setStoreDeleteItemModal,
    resetApolloCache as resetStoreApolloCache,
} from 'src/client/store'
import { Fn, Nullable } from 'src/types'

type SetMenuOpen = Fn<[boolean], void>
type SetDeleteItemModal = Fn<[Nullable<string>], void>

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

export const useDeleteItemModal = (): [
    Nullable<string>,
    SetDeleteItemModal,
] => {
    const [
        {
            option: { deleteItemModal },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    const setDeleteItemModal = (option: Nullable<string>) => {
        dispatch(setStoreDeleteItemModal(option))
    }

    return [deleteItemModal, setDeleteItemModal]
}

export const useCloseModal = (): Fn<[void], void> => {
    const [, dispatch] = useContext(Context) as ContextType

    const closeModal = () => {
        dispatch(setStoreDeleteItemModal(undefined))
    }

    return closeModal
}

export const useResetApolloCache = (): Fn<[void], void> => {
    const [, dispatch] = useContext(Context) as ContextType

    const resetApolloCache = () => {
        dispatch(resetStoreApolloCache())
    }

    return resetApolloCache
}
