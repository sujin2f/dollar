import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTable,
    AccountBookTypeSelector,
    CategoryGraph,
    RemoveItemModal,
    Modal,
} from 'src/client/components'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'

export const Home = (): JSX.Element => {
    const { type, year, month, removeId } = useAccountBookMatch()
    const addressBack =
        '/' + ['app', type, year, month].filter((v) => v).join('/')

    return (
        <Fragment>
            {removeId && (
                <Modal addressBack={addressBack}>
                    <RemoveItemModal addressBack={addressBack} />
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
