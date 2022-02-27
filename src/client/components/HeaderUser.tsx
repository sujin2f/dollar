import React, { Fragment, useState } from 'react'

import { User } from 'src/types'
import { setDarkMode } from 'src/client/hooks'

type Props = {
    user: User
}

export const HeaderUser = (props: Props): JSX.Element => {
    const [menuOpened, changeMenuOpened] = useState<boolean>(false)

    return (
        <aside className="aside">
            <button
                className="hamburger"
                aria-label="Open Menu"
                onClick={() => changeMenuOpened(!menuOpened)}
            >
                <div />
                <div />
                <div />
            </button>
            {menuOpened && (
                <div
                    className="overlay"
                    onClick={() => changeMenuOpened(false)}
                >
                    <nav className="aside__menu">
                        <div className="aside__greeting__container">
                            {props.user.photo && (
                                <img
                                    src={props.user.photo}
                                    role="presentation"
                                    alt=""
                                    className="aside__profile"
                                />
                            )}
                            <p className="aside__greeting">
                                Hello {props.user.name}!
                            </p>
                        </div>
                        <button
                            className="aside__menu__item"
                            onClick={() => setDarkMode(!props.user.darkMode)}
                        >
                            {!props.user.darkMode && (
                                <Fragment>Dark mode</Fragment>
                            )}
                            {props.user.darkMode && (
                                <Fragment>Light mode</Fragment>
                            )}
                        </button>
                        <a href="/" className="aside__menu__item">
                            Reload
                        </a>
                        <a href="/auth/logout" className="aside__menu__item">
                            Logout
                        </a>
                    </nav>
                </div>
            )}
        </aside>
    )
}
