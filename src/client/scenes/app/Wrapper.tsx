import React, { Fragment, PropsWithChildren } from 'react'
import { AppHeader, Menu } from 'src/client/components'

import { useUser } from 'src/client/hooks'
import { isApiState, User } from 'src/types'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const maybeUser = useUser()
    if (isApiState(maybeUser)) {
        // TODO Loading
        return <Fragment />
    }

    const user = maybeUser as User
    const classDarkMode = user.darkMode ? 'wrapper--dark-mode' : ''

    return (
        <Fragment>
            {/* Profile image preload */}
            {user.photo && <link rel="preload" as="image" href={user.photo} />}

            <div className={`wrapper ${classDarkMode}`}>
                <AppHeader />
                <Menu />
                <main className="main row">
                    <div className="columns small-12">{prop.children}</div>
                </main>
            </div>
        </Fragment>
    )
}
