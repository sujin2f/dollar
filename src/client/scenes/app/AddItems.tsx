import React, { Fragment } from 'react'
import { AddItemsForm, AddItemsTable } from 'src/client/components'
import { usePreItem } from 'src/client/hooks'

export const AddItems = (): JSX.Element => {
    const { preItems } = usePreItem()

    const hasProcessed = preItems.preItemsDataset.length !== 0

    return (
        <Fragment>
            {!hasProcessed && <AddItemsForm />}
            {hasProcessed && <AddItemsTable />}
        </Fragment>
    )
}
