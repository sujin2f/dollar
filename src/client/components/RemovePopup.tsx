import React, { useContext, useEffect, useRef } from 'react'

import { removeItem } from 'src/client/hooks'
import { Context, ContextType, closeRemovePopup } from 'src/client/store'

export const RemovePopup = (): JSX.Element => {
    const [{ removePopup }, dispatch] = useContext(Context) as ContextType
    const submitButton = useRef<HTMLButtonElement>(null)

    const onDeleteClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault()
        if (typeof removePopup === 'string') {
            removeItem(removePopup)
        }
        dispatch(closeRemovePopup())
    }

    useEffect(() => {
        submitButton.current && submitButton.current.focus()
    }, [submitButton])

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            dispatch(closeRemovePopup())
        }
        if (e.key === 'Enter') {
            onDeleteClick(e)
        }
    }

    return (
        <div className="overlay" onClick={() => dispatch(closeRemovePopup())}>
            <section className="modal">
                <p>Do you really want to remove this item?</p>
                <div className="button__container">
                    <button
                        onClick={() => dispatch(closeRemovePopup())}
                        className="button"
                        onKeyDown={onKeyDown}
                    >
                        Cancel
                    </button>
                    <button
                        className="button button--primary"
                        onClick={onDeleteClick}
                        ref={submitButton}
                        onKeyDown={onKeyDown}
                    >
                        Remove Item
                    </button>
                </div>
            </section>
        </div>
    )
}
