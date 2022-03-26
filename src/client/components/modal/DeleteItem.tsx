import React, { Fragment } from 'react'
import { useGlobalOption, useItems } from 'src/client/hooks'
import { itemToRawItem } from 'src/types/model'
import { Button } from 'src/common/components/forms/Button'

export const DeleteItem = (): JSX.Element => {
    const { deleteItemOpened: item, closeComponents } = useGlobalOption()
    const { deleteItem } = useItems()

    const onClick = () => {
        if (!item) {
            return
        }
        deleteItem({
            variables: {
                rawItem: itemToRawItem(item),
                type: 'delete',
            },
        })
        closeComponents()
    }

    return (
        <Fragment>
            <h1>Delete Item</h1>
            <p className="lead">Do you want to remove {item?.title}?</p>

            <Button onClick={onClick} autoFocus title="Confirm" />
        </Fragment>
    )
}
