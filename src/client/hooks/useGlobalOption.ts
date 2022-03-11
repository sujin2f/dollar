import { useContext } from 'react'

import { ContextType, Context } from 'src/client/store'
import {
    setMenuOpen as setStoreMenuOpen,
    setDeleteModal as setStoreDeleteModal,
    setUpdateModal as setStoreUpdateModal,
    closeModal as closeStoreModal,
    setCallOut as setStoreCallOut,
} from 'src/client/store/actions'
import { Item } from 'src/types/model'

export const useGlobalOption = () => {
    const [
        {
            menuOpen,
            modal: { deleteItem, updateItem },
            callout: { message: callOutMessage, timeout },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    const keyCloseModal = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeModal()
        }
    }

    const setMenuOpen = (option: boolean) => {
        dispatch(setStoreMenuOpen(option))
    }

    const setDeleteModal = (item: Item) => {
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreDeleteModal(item))
    }

    const setUpdateModal = (item: Item) => {
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreUpdateModal(item))
    }

    const closeModal = () => {
        document.removeEventListener('keydown', keyCloseModal)
        dispatch(closeStoreModal())
    }

    const createTimeout = () =>
        setTimeout(() => {
            closeCallout()
        }, 5000)

    const closeCallout = () => {
        if (timeout) {
            clearTimeout(timeout)
        }
        dispatch(setStoreCallOut())
    }

    const setCallout = (message: string) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        dispatch(setStoreCallOut(message, createTimeout()))
    }

    return {
        menuOpen,
        deleteItem,
        updateItem,
        setMenuOpen,
        setDeleteModal,
        setUpdateModal,
        closeModal,
        callOutMessage,
        setCallout,
        closeCallout,
    }
}
