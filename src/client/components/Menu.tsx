import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { useGlobalOption, useUser } from 'src/client/hooks'
import { Loading } from '.'

export const Menu = (): JSX.Element => {
    const { loading, user, setDarkMode } = useUser()
    const { menuOpen, setMenuOpen } = useGlobalOption()
    // const { setDarkMode } = useUser()

    if (loading || !user) {
        return <Loading />
    }

    if (!menuOpen) {
        return <Fragment />
    }

    const darkModeButtonText = user.darkMode ? 'Light mode' : 'Dark mode'

    console.log(user)

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
                    onClick={() =>
                        setDarkMode({
                            variables: {
                                darkMode: !user.darkMode,
                            },
                        })
                    }
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
