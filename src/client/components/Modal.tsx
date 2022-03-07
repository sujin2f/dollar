import React, { MouseEvent, PropsWithChildren, useRef } from 'react'
import { useGlobalOption } from 'src/client/hooks'

export const Modal = (props: PropsWithChildren<{}>): JSX.Element => {
    const { setDeleteItemModal } = useGlobalOption()
    const overlay = useRef<HTMLDivElement>(null)

    const mayCloseModal = (e: MouseEvent) => {
        if (e.target !== overlay.current) {
            e.preventDefault()
            return
        }
        setDeleteItemModal()
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
