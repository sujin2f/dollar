import React from 'react'
import { useMenuOpen } from '../hooks'

export const Hamburger = (): JSX.Element => {
    const [menuOpen, setMenuOpen] = useMenuOpen()

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
