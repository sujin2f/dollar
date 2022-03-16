import React, { PropsWithChildren } from 'react'

import { useOverlay } from 'src/client/hooks'
import { CloseButton, Button } from 'src/client/components'

export const Modal = (props: PropsWithChildren<{}>): JSX.Element => {
    const { closeModal, Overlay } = useOverlay()

    return (
        <Overlay className="reveal-overlay" style={{ display: 'block' }}>
            <div className="reveal" style={{ display: 'block' }}>
                {props.children}

                <Button
                    className="secondary"
                    onClick={closeModal}
                    title="Cancel"
                />

                <CloseButton onClick={closeModal} />
            </div>
        </Overlay>
    )
}
