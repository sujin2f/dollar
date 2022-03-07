import React from 'react'
import { useGlobalOption } from 'src/client/hooks'
import { useItems } from 'src/client/hooks'

export const DeleteItemModal = (): JSX.Element => {
    const { deleteItemModal, setDeleteItemModal } = useGlobalOption()
    const { deleteItem } = useItems()

    return (
        <div className="reveal" style={{ display: 'block' }}>
            <h1>Remove Item</h1>
            <p className="lead">Do you want to remove this item?</p>

            <button
                className="button"
                onClick={() => deleteItem(deleteItemModal || '')}
                autoFocus
            >
                Confirm
            </button>
            <button
                className="button secondary"
                onClick={() => setDeleteItemModal()}
            >
                Cancel
            </button>
            <button
                className="close-button"
                aria-label="Close reveal"
                type="button"
                onClick={() => setDeleteItemModal()}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}
