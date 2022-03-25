/**
 * @jest-environment jsdom
 */
// yarn test useGlobalOption.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import { useGlobalOption } from './useGlobalOption'
import { Store } from 'src/client/store'
import { Category, Item } from 'src/types/model'

describe('useGlobalOption.ts', () => {
    let Component: () => JSX.Element
    const Wrapper = () => (
        <Store>
            <Component />
        </Store>
    )

    it('menuOpen and escape key', async () => {
        Component = (): JSX.Element => {
            const { menuOpen, openMenu } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {menuOpen ? 'true' : 'false'}
                    </div>
                    <button onClick={() => openMenu()} data-testid="trigger" />
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
            const { deleteItemOpened, openDeleteModal } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {deleteItemOpened ? deleteItemOpened.title : 'false'}
                    </div>
                    <button
                        onClick={() =>
                            openDeleteModal({
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
            const {
                deleteItemOpened,
                updateItemOpened,
                openDeleteModal,
                openUpdateModal,
            } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {deleteItemOpened ? deleteItemOpened.title : 'false'}
                    </div>
                    <button
                        onClick={() =>
                            openDeleteModal({
                                title: 'title',
                            } as Item)
                        }
                        data-testid="trigger"
                    />
                    <div data-testid="indicator2">
                        {updateItemOpened ? updateItemOpened.title : 'false'}
                    </div>
                    <button
                        onClick={() =>
                            openUpdateModal({
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
            const { addItemOpened, openAddModal } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {addItemOpened ? 'true' : 'false'}
                    </div>
                    <button
                        onClick={() => openAddModal()}
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

    describe('callOutMessage', () => {
        jest.setTimeout(6000)
        it('callOutMessage', async () => {
            Component = (): JSX.Element => {
                const { callOutMessage, openCallout, closeCallout } =
                    useGlobalOption()

                return (
                    <div>
                        <div data-testid="indicator">
                            {callOutMessage || 'false'}
                        </div>
                        <button
                            onClick={() => openCallout('CALL OUT')}
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
            expect(screen.getByTestId('indicator')).toHaveTextContent(
                'CALL OUT',
            )
            fireEvent.click(screen.getByTestId('trigger2'))
            expect(screen.getByTestId('indicator')).toHaveTextContent('false')

            // Timeout
            fireEvent.click(screen.getByTestId('trigger'))
            await act(
                async () =>
                    await new Promise((resolve) => setTimeout(resolve, 5500)),
            )
            expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        })
    })

    it('categorySelector', async () => {
        Component = (): JSX.Element => {
            const { categorySelectorOpened, openCategorySelector } =
                useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {categorySelectorOpened ? 'true' : 'false'}
                    </div>
                    <button
                        onClick={() => openCategorySelector()}
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

    it('categoryEditor', () => {
        Component = (): JSX.Element => {
            const {
                categoryEditorOpened,
                openCategoryEditor,
                closeCategoryEditor,
            } = useGlobalOption()

            return (
                <div>
                    <div data-testid="indicator">
                        {categoryEditorOpened ? 'true' : 'false'}
                    </div>
                    <button
                        onClick={() => openCategoryEditor({} as Category)}
                        data-testid="trigger"
                    />
                    <button
                        onClick={() => closeCategoryEditor()}
                        data-testid="trigger-close"
                    />
                </div>
            )
        }
        render(<Wrapper />)

        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
        fireEvent.click(screen.getByTestId('trigger'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('true')
        fireEvent.click(screen.getByTestId('trigger-close'))
        expect(screen.getByTestId('indicator')).toHaveTextContent('false')
    })
})
