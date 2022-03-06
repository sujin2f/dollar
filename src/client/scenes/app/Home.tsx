import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTable,
    AccountBookTypeSelector,
    CategoryGraph,
    DeleteItemModal,
    Modal,
} from 'src/client/components'
import { useAccountBookMatch, useDeleteItemModal } from 'src/client/hooks'
import { TableType } from 'src/constants'

export const Home = (): JSX.Element => {
    const [deleteItemModal] = useDeleteItemModal()
    const { type } = useAccountBookMatch()

    return (
        <Fragment>
            {deleteItemModal && (
                <Modal>
                    <DeleteItemModal />
                </Modal>
            )}
            <AccountBookTypeSelector />
            <AccountBookHeader />

            {type === TableType.Daily && (
                <Fragment>
                    <CategoryGraph />
                    <AccountBookTable />
                </Fragment>
            )}
        </Fragment>
    )
}
