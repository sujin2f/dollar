import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { useDarkMode, useMenuOpen, useUser } from 'src/client/hooks'
import { isApiState, User } from 'src/types'
import { Loading } from '.'

export const Menu = (): JSX.Element => {
    const maybeUser = useUser()
    const [menuOpen, setMenuOpen] = useMenuOpen()
    const setDarkMode = useDarkMode()

    if (isApiState(maybeUser)) {
        return <Loading />
    }

    if (!menuOpen) {
        return <Fragment />
    }

    const user = maybeUser as User
    const darkModeButtonText = user.darkMode ? 'Light mode' : 'Dark mode'

    return (
        <div onClick={() => setMenuOpen(false)}>
            <nav className="menu">
                <div className="greeting__container">
                    {user.photo && (
                        <img
                            src={user.photo}
                            role="presentation"
                            alt="profile"
                            className="profile-image"
                        />
                    )}
                    <p className="greeting">Hello {user.name}!</p>
                </div>
                <Link to="/app" className="menu__item">
                    Home
                </Link>
                <Link to="/app/add" className="menu__item">
                    Add Item
                </Link>
                <Link to="/app/add/text" className="menu__item">
                    Add by Text
                </Link>
                <Link
                    to="#"
                    className="menu__item"
                    onClick={() => setDarkMode(!user.darkMode)}
                >
                    {darkModeButtonText}
                </Link>
                <a href="/auth/logout" className="menu__item">
                    Logout
                </a>
            </nav>
        </div>
    )
}
