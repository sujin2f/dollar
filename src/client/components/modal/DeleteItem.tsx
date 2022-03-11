import React, { Fragment } from 'react'
import { useGlobalOption, useItems } from 'src/client/hooks'

export const DeleteItem = (): JSX.Element => {
    const { deleteItem: item, closeModal } = useGlobalOption()
    const { deleteItem } = useItems()

    return (
        <Fragment>
            <h1>Delete Item</h1>
            <p className="lead">Do you want to remove {item?.title}?</p>

            <button
                className="button"
                onClick={() => {
                    deleteItem({
                        variables: {
                            _id: item!._id,
                        },
                    })
                    closeModal()
                }}
                autoFocus
            >
                Confirm
            </button>
        </Fragment>
    )
}
