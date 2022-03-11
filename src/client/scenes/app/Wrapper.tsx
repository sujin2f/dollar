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
} from 'src/client/components'

import { useUser, useGlobalOption } from 'src/client/hooks'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const { deleteItem, updateItem, addItem } = useGlobalOption()
    const { loading, user } = useUser()

    if (loading || !user) {
        return <Loading />
    }

    const classDarkMode = user.darkMode ? 'wrapper--dark-mode' : ''

    return (
        <div className={`wrapper ${classDarkMode}`}>
            {/* Delete Modal */}
            {deleteItem && (
                <Modal>
                    <DeleteItemModal />
                </Modal>
            )}

            {/* Update Modal */}
            {updateItem && (
                <Modal>
                    <UpdateItemModal />
                </Modal>
            )}

            {/* Add Modal */}
            {addItem && (
                <Modal>
                    <AddItemModal />
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
