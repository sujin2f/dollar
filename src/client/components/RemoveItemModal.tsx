import React from 'react'
import { useItems } from 'src/client/hooks'
import { Fn } from 'src/types/common'
import { Item } from 'src/types/model'

type Props = {
    closeModal: Fn<[void], void>
    item: Item
}

export const RemoveItemModal = (props: Props): JSX.Element => {
    const { removeItem } = useItems()

    return (
        <div className="reveal" style={{ display: 'block' }}>
            <h1>Remove Item</h1>
            <p className="lead">Do you want to remove {props.item.title}?</p>

            <button
                className="button"
                onClick={() => {
                    removeItem({
                        variables: {
                            _id: props.item._id,
                        },
                    })
                    props.closeModal()
                }}
                autoFocus
            >
                Confirm
            </button>
            <button
                className="button secondary"
                onClick={() => props.closeModal()}
            >
                Cancel
            </button>
            <button
                className="close-button"
                aria-label="Close reveal"
                type="button"
                onClick={() => props.closeModal()}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}
