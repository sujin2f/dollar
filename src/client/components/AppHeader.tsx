import React from 'react'
import { useGlobalOption } from '../hooks'
import { Button } from './form/Button'

import { Hamburger } from './Hamburger'

export const AppHeader = (): JSX.Element => {
    const { setAddModal } = useGlobalOption()
    return (
        <header className="header flex flex--space-between">
            <div>
                <Hamburger />
            </div>
            <div>
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
