import React from 'react'
import { useDeleteItemModal } from 'src/client/hooks'
import { useDeleteItem } from 'src/client/hooks/useItems'

export const DeleteItemModal = (): JSX.Element => {
    const [, setDeleteItemModal] = useDeleteItemModal()
    const deleteItem = useDeleteItem()

    return (
        <div className="reveal" style={{ display: 'block' }}>
            <h1>Remove Item</h1>
            <p className="lead">Do you want to remove this item?</p>

            <button className="button" onClick={() => deleteItem()} autoFocus>
                Confirm
            </button>
            <button
                className="button secondary"
                onClick={() => setDeleteItemModal(undefined)}
            >
                Cancel
            </button>
            <button
                className="close-button"
                aria-label="Close reveal"
                type="button"
                onClick={() => setDeleteItemModal(undefined)}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}
