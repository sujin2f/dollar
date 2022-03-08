import React from 'react'
import { useHistory } from 'react-router-dom'
import { useAccountBookMatch, useItems } from 'src/client/hooks'

export const RemoveItemModal = (props: {
    addressBack: string
}): JSX.Element => {
    const history = useHistory()
    const { removeId } = useAccountBookMatch()
    const { removeItem } = useItems()

    return (
        <div className="reveal" style={{ display: 'block' }}>
            <h1>Remove Item</h1>
            <p className="lead">Do you want to remove this item?</p>

            <button
                className="button"
                onClick={() =>
                    removeItem({
                        variables: {
                            _id: removeId!,
                        },
                    })
                }
                autoFocus
            >
                Confirm
            </button>
            <button
                className="button secondary"
                onClick={() => history.push(props.addressBack)}
            >
                Cancel
            </button>
            <button
                className="close-button"
                aria-label="Close reveal"
                type="button"
                onClick={() => history.push(props.addressBack)}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}
