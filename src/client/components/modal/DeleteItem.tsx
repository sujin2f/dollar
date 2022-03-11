import React, { Fragment } from 'react'
import { useGlobalOption, useItems } from 'src/client/hooks'
import { Button } from '../form/Button'

export const DeleteItem = (): JSX.Element => {
    const { deleteItem: item, closeModal } = useGlobalOption()
    const { deleteItem } = useItems()

    const onClick = () => {
        deleteItem({
            variables: {
                _id: item!._id,
            },
        })
        closeModal()
    }

    return (
        <Fragment>
            <h1>Delete Item</h1>
            <p className="lead">Do you want to remove {item?.title}?</p>

            <Button onClick={onClick} autoFocus title="Confirm" />
        </Fragment>
    )
}
