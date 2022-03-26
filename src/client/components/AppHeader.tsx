import React from 'react'
import { useGlobalOption } from 'src/client/hooks'
import { Hamburger } from 'src/client/components'
import { Button } from 'src/common/components/forms/Button'

export const AppHeader = (): JSX.Element => {
    const {
        categorySelectorOpened,
        openAddModal,
        openCategorySelector,
        closeComponents,
    } = useGlobalOption()

    return (
        <header className="header flex flex--space-between">
            <div>
                <Hamburger />
            </div>
            <div>
                <Button
                    className="primary add-item"
                    onClick={() =>
                        categorySelectorOpened
                            ? closeComponents()
                            : openCategorySelector()
                    }
                    title="Category Selector"
                    icon="price-tag"
                />
                <Button
                    className="primary add-item"
                    onClick={openAddModal}
                    title="Add Item"
                    icon="plus"
                />
            </div>
        </header>
    )
}
