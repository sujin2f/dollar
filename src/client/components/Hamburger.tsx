import React from 'react'
import { useGlobalOption } from '../hooks'

export const Hamburger = (): JSX.Element => {
    const { menuOpen, openMenu, closeComponents } = useGlobalOption()

    return (
        <button
            className="hamburger"
            aria-label="Open Menu"
            onClick={() => (menuOpen ? closeComponents() : openMenu())}
        >
            <div />
            <div />
            <div />
        </button>
    )
}
