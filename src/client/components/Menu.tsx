import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { useGlobalOption, useUser } from 'src/client/hooks'
import { Loading } from '.'

export const Menu = (): JSX.Element => {
    const { loading, user, setUser } = useUser()
    const { menuOpen, closeComponents } = useGlobalOption()

    if (loading || !user) {
        return <Loading />
    }

    if (!menuOpen) {
        return <Fragment />
    }

    const darkModeButtonText = user.darkMode ? 'Light mode' : 'Dark mode'

    return (
        <div onClick={() => closeComponents()}>
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
                <Link to="/app/add/bulkAdd" className="menu__item">
                    Add by Text
                </Link>
                <Link
                    to="#"
                    className="menu__item"
                    onClick={() =>
                        setUser({
                            variables: {
                                user: {
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    darkMode: !user.darkMode,
                                },
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
