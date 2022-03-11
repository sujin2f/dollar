import React, { Fragment } from 'react'
import { useGlobalOption } from '../hooks'
import { Column } from './Column'
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
                    <button
                        className="close-button"
                        aria-label="Dismiss alert"
                        onClick={closeCallout}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </Column>
        </Row>
    )
}
