import React from 'react'
import { useGlobalOption } from 'src/client/hooks'
import { Button, Hamburger } from 'src/client/components'

export const AppHeader = (): JSX.Element => {
    const { categorySelector, setAddModal, setCategorySelector, closeModal } =
        useGlobalOption()

    return (
        <header className="header flex flex--space-between">
            <div>
                <Hamburger />
            </div>
            <div>
                <Button
                    className="primary add-item"
                    onClick={() =>
                        categorySelector ? closeModal() : setCategorySelector()
                    }
                    title="Category Selector"
                    icon="price-tag"
                />
                <Button
                    className="primary add-item"
                    onClick={setAddModal}
                    title="Add Item"
                    icon="plus"
                />
            </div>
        </header>
    )
}
