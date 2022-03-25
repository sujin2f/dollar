import React, { PropsWithChildren, FormEvent } from 'react'

import { useOverlay, useGlobalOption } from 'src/client/hooks'
import { CloseButton, Button } from 'src/client/components'

type Props = {
    closeModal?: (e?: FormEvent<Element>) => void
}
export const Modal = (props: PropsWithChildren<Props>): JSX.Element => {
    const { Overlay } = useOverlay()
    const { closeComponents } = useGlobalOption()
    const closeModal = props.closeModal ? props.closeModal : closeComponents

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
