import { useContext } from 'react'

import { ContextType, Context } from 'src/client/store'
import {
    setMenuOpen as setStoreMenuOpen,
    setDeleteModal as setStoreDeleteModal,
    setUpdateModal as setStoreUpdateModal,
    closeModal as closeStoreModal,
} from 'src/client/store/actions'
import { Item } from 'src/types/model'

export const useGlobalOption = () => {
    const [{ menuOpen, deleteModal, updateModal }, dispatch] = useContext(
        Context,
    ) as ContextType

    const setMenuOpen = (option: boolean) => {
        dispatch(setStoreMenuOpen(option))
    }

    const setDeleteModal = (item: Item) => {
        document.addEventListener('keydown', closeModal)
        dispatch(setStoreDeleteModal(item))
    }

    const setUpdateModal = (item: Item) => {
        document.addEventListener('keydown', closeModal)
        dispatch(setStoreUpdateModal(item))
    }

    const closeModal = () => {
        document.removeEventListener('keydown', closeModal)
        dispatch(closeStoreModal())
    }

    return {
        menuOpen,
        deleteModal,
        updateModal,
        setMenuOpen,
        setDeleteModal,
        setUpdateModal,
        closeModal,
    }
}
