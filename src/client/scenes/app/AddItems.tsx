import React, { Fragment, useState } from 'react'
import { AddItemsForm, AddItemsTable } from 'src/client/components'
import { useRawItem } from 'src/client/hooks'
import { RawItem } from 'src/types/model'

export const AddItems = (): JSX.Element => {
    const [items, changeInput] = useState<RawItem[]>([])
    const { rawItems } = useRawItem(items)

    const hasProcessed = rawItems.length !== 0

    return (
        <Fragment>
            {!hasProcessed && <AddItemsForm changeInput={changeInput} />}
            {hasProcessed && (
                <AddItemsTable items={rawItems} changeInput={changeInput} />
            )}
        </Fragment>
    )
}
