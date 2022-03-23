/**
 * @jest-environment jsdom
 */
// yarn test useGlobalOption.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useGlobalOption } from './useGlobalOption'
import { Store } from 'src/client/store'
import { Item } from 'src/types/model'

describe('useGlobalOption.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <Store>
            <Component />
        </Store>
    )

    it('menuOpen and escape key', async () => {
        Component = (): JSX.Element => {
            const { menuOpen, setMenuOpen } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {menuOpen ? 'true' : 'false'}
                    </div>
                    <button
                        onClick={() => setMenuOpen(true)}
                        data-testid="trigger"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('true')
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
    })

    it('deleteItem', async () => {
        Component = (): JSX.Element => {
            const { deleteItem, setDeleteModal } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {deleteItem ? deleteItem.title : 'false'}
                    </div>
                    <button
                        onClick={() =>
                            setDeleteModal({
                                title: 'title',
                            } as Item)
                        }
                        data-testid="trigger"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('title')
    })

    it('deleteItem & close another modal', async () => {
        Component = (): JSX.Element => {
            const { deleteItem, updateItem, setDeleteModal, setUpdateModal } =
                useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {deleteItem ? deleteItem.title : 'false'}
                    </div>
                    <button
                        onClick={() =>
                            setDeleteModal({
                                title: 'title',
                            } as Item)
                        }
                        data-testid="trigger"
                    />
                    <div data-testid="indicator2">
                        {updateItem ? updateItem.title : 'false'}
                    </div>
                    <button
                        onClick={() =>
                            setUpdateModal({
                                title: 'title',
                            } as Item)
                        }
                        data-testid="trigger2"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('title')
        expect(screen.getByTestId('indicator2')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger2'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        expect(screen.getByTestId('indicator2')).toHaveTextContent('title')
    })

    it('addItem', async () => {
        Component = (): JSX.Element => {
            const { addItem, setAddModal } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {addItem ? 'true' : 'false'}
                    </div>
                    <button
                        onClick={() => setAddModal()}
                        data-testid="trigger"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('true')
    })

    it('callOutMessage', async () => {
        Component = (): JSX.Element => {
            const { callOutMessage, setCallout, closeCallout } =
                useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {callOutMessage || 'false'}
                    </div>
                    <button
                        onClick={() => setCallout('CALL OUT')}
                        data-testid="trigger"
                    />
                    <button
                        onClick={() => closeCallout()}
                        data-testid="trigger2"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('CALL OUT')
        fireEvent.click(screen.getByTestId('trigger2'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
    })

    it('categorySelector', async () => {
        Component = (): JSX.Element => {
            const { categorySelector, setCategorySelector } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {categorySelector ? 'true' : 'false'}
                    </div>
                    <button
                        onClick={() => setCategorySelector()}
                        data-testid="trigger"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('true')
    })
})
