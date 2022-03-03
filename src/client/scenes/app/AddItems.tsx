import React, { Fragment } from 'react'
import { AddItemsForm, AddItemsTable } from 'src/client/components'
import { useGetPreItems } from 'src/client/hooks'

export const AddItems = (): JSX.Element => {
    const [{ preItemsDataset }] = useGetPreItems()

    const hasProcessed = preItemsDataset.length !== 0
    return (
        <Fragment>
            {!hasProcessed && <AddItemsForm />}
            {hasProcessed && <AddItemsTable />}
        </Fragment>
    )
}
