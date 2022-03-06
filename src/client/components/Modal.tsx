import React, { MouseEvent, PropsWithChildren, useRef } from 'react'
import { useCloseModal } from 'src/client/hooks'

export const Modal = (props: PropsWithChildren<{}>): JSX.Element => {
    const closeModal = useCloseModal()
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
            {props.children}
        </div>
    )
}
