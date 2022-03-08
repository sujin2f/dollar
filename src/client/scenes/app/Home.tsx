import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTable,
    AccountBookTypeSelector,
    CategoryGraph,
    DeleteItemModal,
    Modal,
} from 'src/client/components'
import { useAccountBookMatch, useGlobalOption } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'

export const Home = (): JSX.Element => {
    const { deleteItemModal } = useGlobalOption()
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
