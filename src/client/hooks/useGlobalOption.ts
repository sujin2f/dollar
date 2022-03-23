import { useContext } from 'react'

import { ContextType, Context } from 'src/client/store'
import {
    setMenuOpen as setStoreMenuOpen,
    setDeleteModal as setStoreDeleteModal,
    setUpdateModal as setStoreUpdateModal,
    closeModal as closeStoreModal,
    setCallOut as setStoreCallOut,
    setAddModal as setStoreAddItemModal,
    setCategorySelector as setStoreCategorySelector,
} from 'src/client/store/actions'
import { Item } from 'src/types/model'

export const useGlobalOption = () => {
    const [
        {
            menuOpen,
            modal: { deleteItem, updateItem, addItem, categorySelector },
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
        closeModal()
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreMenuOpen(option))
    }

    const setDeleteModal = (item: Item) => {
        closeModal()
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreDeleteModal(item))
    }

    const setUpdateModal = (item: Item) => {
        closeModal()
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreUpdateModal(item))
    }

    const setAddModal = () => {
        closeModal()
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreAddItemModal(true))
    }

    const setCategorySelector = () => {
        closeModal()
        document.addEventListener('keydown', keyCloseModal)
        dispatch(setStoreCategorySelector(true))
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
        closeModal,
        menuOpen,
        setMenuOpen,
        deleteItem,
        setDeleteModal,
        updateItem,
        setUpdateModal,
        addItem,
        setAddModal,
        callOutMessage,
        setCallout,
        closeCallout,
        categorySelector,
        setCategorySelector,
    }
}
