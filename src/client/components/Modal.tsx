import React, { MouseEvent, PropsWithChildren, useRef } from 'react'
import { useGlobalOption } from '../hooks'

export const Modal = (props: PropsWithChildren<{}>): JSX.Element => {
    const { closeModal } = useGlobalOption()
    const overlay = useRef<HTMLDivElement>(null)

    const mayCloseModal = (e: MouseEvent) => {
        if (e.target !== overlay.current) {
            e.preventDefault()
            return
        }
        closeModal()
    }

    return (
        <div
            className="reveal-overlay"
            style={{ display: 'block' }}
            ref={overlay}
            onClick={(e) => mayCloseModal(e)}
        >
            <div className="reveal" style={{ display: 'block' }}>
                {props.children}

                <button
                    className="button secondary"
                    onClick={() => closeModal()}
                >
                    Cancel
                </button>
                <button
                    className="close-button"
                    aria-label="Close reveal"
                    type="button"
                    onClick={() => closeModal()}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    )
}
