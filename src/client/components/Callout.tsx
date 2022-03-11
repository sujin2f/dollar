import React, { Fragment } from 'react'
import { useGlobalOption } from '../hooks'
import { Column } from './Column'
import { CloseButton } from './form/CloseButton'
import { Row } from './Row'

export const Callout = (): JSX.Element => {
    const { callOutMessage, closeCallout } = useGlobalOption()

    if (!callOutMessage) {
        return <Fragment />
    }

    return (
        <Row className="callout__wrapper">
            <Column>
                <div className="callout alert">
                    <p>{callOutMessage}</p>
                    <CloseButton onClick={closeCallout} />
                </div>
            </Column>
        </Row>
    )
}
