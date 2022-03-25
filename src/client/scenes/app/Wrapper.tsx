import React, { PropsWithChildren } from 'react'
import {
    AppHeader,
    Menu,
    Loading,
    CategorySelector,
    Callout,
    Modal,
    DeleteItemModal,
    UpdateItemModal,
    AddItemModal,
    CategoryEditorModal,
} from 'src/client/components'

import { useUser, useGlobalOption } from 'src/client/hooks'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const {
        deleteItemOpened,
        updateItemOpened,
        addItemOpened,
        categoryEditorOpened,
        closeCategoryEditor,
    } = useGlobalOption()
    const { loading, user } = useUser()

    if (loading || !user) {
        return <Loading />
    }

    const classDarkMode = user.darkMode ? 'wrapper--dark-mode' : ''

    return (
        <div className={`wrapper ${classDarkMode}`}>
            {/* Delete Modal */}
            {deleteItemOpened && (
                <Modal>
                    <DeleteItemModal />
                </Modal>
            )}

            {/* Update Modal */}
            {updateItemOpened && (
                <Modal>
                    <UpdateItemModal />
                </Modal>
            )}

            {/* Add Modal */}
            {addItemOpened && (
                <Modal>
                    <AddItemModal />
                </Modal>
            )}

            {/* Category Editor Modal */}
            {categoryEditorOpened && (
                <Modal closeModal={closeCategoryEditor}>
                    <CategoryEditorModal />
                </Modal>
            )}

            <Callout />
            <AppHeader />
            <CategorySelector />
            <Menu />
            <main className="main">{prop.children}</main>
        </div>
    )
}
