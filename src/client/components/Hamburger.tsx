import React from 'react'
import { useGlobalOption } from '../hooks'

export const Hamburger = (): JSX.Element => {
    const { menuOpen, setMenuOpen } = useGlobalOption()

    return (
        <button
            className="hamburger"
            aria-label="Open Menu"
            onClick={() => setMenuOpen(!menuOpen)}
        >
            <div />
            <div />
            <div />
        </button>
    )
}
