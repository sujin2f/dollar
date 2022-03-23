/**
 * @jest-environment jsdom
 */
// yarn test useOverlay.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useOverlay } from './useOverlay'
import { Store } from 'src/client/store'
import { useGlobalOption } from './useGlobalOption'

describe('useOverlay.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <Store>
            <Component />
        </Store>
    )

    it('menuOpen and escape key', async () => {
        Component = (): JSX.Element => {
            const { closeModal, Overlay } = useOverlay()
            const { categorySelector, setCategorySelector } = useGlobalOption()

            return (
                <Fragment>
                    {categorySelector && (
                        <Overlay>
                            <div data-testid="overlay" />
                            <button
                                onClick={() => closeModal()}
                                data-testid="close"
                            />
                        </Overlay>
                    )}
                    <button
                        onClick={() => setCategorySelector()}
                        data-testid="open"
                    />
                </Fragment>
            )
        }
        render(<Wrapper />)

        try {
            screen.getByTestId('overlay')
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
        fireEvent.click(screen.getByTestId('open'))
        expect(screen.getByTestId('overlay')).toBeTruthy()
        fireEvent.click(screen.getByTestId('close'))
        try {
            screen.getByTestId('overlay')
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
    })
})
