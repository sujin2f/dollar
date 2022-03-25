import { useContext } from 'react'

import { ContextType, Context } from 'src/client/store'
import {
    setMenuOpen,
    setDeleteModal,
    setUpdateModal,
    closeModal,
    setCallOut,
    setAddModal,
    setCategorySelector,
    setCategoryEditor,
} from 'src/client/store/actions'
import { Category, Item } from 'src/types/model'

export const useGlobalOption = () => {
    const [
        {
            menuOpen,
            modal: {
                deleteItemOpened,
                updateItemOpened,
                addItemOpened,
                categorySelectorOpened,
                categoryEditorOpened,
            },
            callout: { message: callOutMessage, timeout },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    const keyCloseModal = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeComponents()
        }
    }

    const openComponent = () => {
        closeComponents()
        document.addEventListener('keydown', keyCloseModal)
    }

    const openMenu = () => {
        openComponent()
        dispatch(setMenuOpen(true))
    }

    const openDeleteModal = (item: Item) => {
        openComponent()
        dispatch(setDeleteModal(item))
    }

    const openUpdateModal = (item: Item) => {
        openComponent()
        dispatch(setUpdateModal(item))
    }

    const openAddModal = () => {
        openComponent()
        dispatch(setAddModal(true))
    }

    const openCategorySelector = () => {
        openComponent()
        dispatch(setCategorySelector(true))
    }

    const closeComponents = () => {
        document.removeEventListener('keydown', keyCloseModal)
        dispatch(closeModal())
    }

    const createTimeout = () =>
        setTimeout(() => {
            closeCallout()
        }, 5000)

    const closeCallout = () => {
        if (timeout) {
            clearTimeout(timeout)
        }
        dispatch(setCallOut())
    }

    const openCallout = (message: string) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        dispatch(setCallOut(message, createTimeout()))
    }

    const openCategoryEditor = (category: Category) => {
        openComponent()
        dispatch(setCategoryEditor(category))
    }

    const closeCategoryEditor = () => {
        closeComponents()
        openCategorySelector()
    }

    return {
        closeComponents,
        menuOpen,
        openMenu,
        deleteItemOpened,
        openDeleteModal,
        updateItemOpened,
        openUpdateModal,
        addItemOpened,
        openAddModal,
        callOutMessage,
        openCallout,
        closeCallout,
        categorySelectorOpened,
        openCategorySelector,
        categoryEditorOpened,
        openCategoryEditor,
        closeCategoryEditor,
    }
}
