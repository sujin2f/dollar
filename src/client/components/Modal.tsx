import React, { MouseEvent, PropsWithChildren, useRef } from 'react'
import { Fn } from 'src/types/common'

type Props = PropsWithChildren<{
    closeModal: Fn<[void], void>
}>

export const Modal = (props: Props): JSX.Element => {
    const overlay = useRef<HTMLDivElement>(null)

    const mayCloseModal = (e: MouseEvent) => {
        if (e.target !== overlay.current) {
            e.preventDefault()
            return
        }
        props.closeModal()
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
