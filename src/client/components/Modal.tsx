import React, { MouseEvent, PropsWithChildren, useRef } from 'react'
import { useGlobalOption } from '../hooks'
import { Button } from './form/Button'
import { CloseButton } from './form/CloseButton'

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

                <Button
                    className="secondary"
                    onClick={closeModal}
                    title="Cancel"
                />

                <CloseButton onClick={closeModal} />
            </div>
        </div>
    )
}
