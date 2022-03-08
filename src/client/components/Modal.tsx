import React, { MouseEvent, PropsWithChildren, useRef } from 'react'
import { useHistory } from 'react-router-dom'

export const Modal = (
    props: PropsWithChildren<{ addressBack: string }>,
): JSX.Element => {
    const history = useHistory()
    const overlay = useRef<HTMLDivElement>(null)

    const mayCloseModal = (e: MouseEvent) => {
        if (e.target !== overlay.current) {
            e.preventDefault()
            return
        }
        history.push(props.addressBack)
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
