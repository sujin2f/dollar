import React, { Fragment, useState } from 'react'
import {
    AccountBookHeader,
    AccountBookTable,
    AccountBookTypeSelector,
    CategoryGraph,
    Modal,
    RemoveItemModal,
} from 'src/client/components'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'
import { Nullable } from 'src/types/common'
import { Item } from 'src/types/model'

export const AccountBook = (): JSX.Element => {
    const { type: typeMatch } = useAccountBookMatch()
    const type = typeMatch || TableType.Daily
    const [remove, changeRemove] = useState<Nullable<Item>>(undefined)

    // State to modal
    const closeModal = () => {
        changeRemove(undefined)
    }

    return (
        <Fragment>
            {remove && (
                <Modal closeModal={closeModal}>
                    <RemoveItemModal closeModal={closeModal} item={remove} />
                </Modal>
            )}

            <AccountBookTypeSelector />
            <AccountBookHeader />

            {type === TableType.Daily && (
                <Fragment>
                    <CategoryGraph />
                    <AccountBookTable removeAction={changeRemove} />
                </Fragment>
            )}
        </Fragment>
    )
}
