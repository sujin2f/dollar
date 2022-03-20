import React, { Fragment, useState } from 'react'
import { AddItemsForm, AddItemsTable, Column, Row } from 'src/client/components'
import { useRawItem } from 'src/client/hooks'
import { RawItem } from 'src/types/model'

export const AddItems = (): JSX.Element => {
    const [items, changeInput] = useState<RawItem[]>([])
    const { rawItems } = useRawItem(items)

    const hasProcessed = rawItems.length !== 0

    return (
        <Fragment>
            {!hasProcessed && (
                <Row>
                    <Column>
                        <AddItemsForm changeInput={changeInput} />
                    </Column>
                </Row>
            )}
            {hasProcessed && (
                <Row>
                    <Column>
                        <AddItemsTable
                            items={rawItems}
                            changeInput={changeInput}
                        />
                    </Column>
                </Row>
            )}
        </Fragment>
    )
}
