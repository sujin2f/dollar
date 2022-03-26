import React, { PropsWithChildren } from 'react'
import {
    AppHeader,
    Menu,
    Loading,
    CategorySelector,
    DeleteItemModal,
    UpdateItemModal,
    AddItemModal,
    CategoryEditorModal,
} from 'src/client/components'
import { Modal } from 'src/common/components/containers/Modal'
import { Callout } from 'src/common/components/containers/Callout'
import { useUser, useGlobalOption } from 'src/client/hooks'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const {
        deleteItemOpened,
        updateItemOpened,
        addItemOpened,
        categoryEditorOpened,
        callOutMessage,
        closeCallout,
        closeCategoryEditor,
        closeComponents,
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
                <Modal closeModal={closeComponents}>
                    <DeleteItemModal />
                </Modal>
            )}
            {/* Update Modal */}
            {updateItemOpened && (
                <Modal closeModal={closeComponents}>
                    <UpdateItemModal />
                </Modal>
            )}
            {/* Add Modal */}
            {addItemOpened && (
                <Modal closeModal={closeComponents}>
                    <AddItemModal />
                </Modal>
            )}
            {/* Category Editor Modal */}
            {categoryEditorOpened && (
                <Modal closeModal={closeCategoryEditor}>
                    <CategoryEditorModal />
                </Modal>
            )}
            <Callout message={callOutMessage || ''} onClick={closeCallout} />
            <AppHeader />
            <CategorySelector />
            <Menu />
            <main className="main">{prop.children}</main>
        </div>
    )
}
