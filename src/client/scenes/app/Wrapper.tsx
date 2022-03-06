import React, { PropsWithChildren } from 'react'
import {
    AppHeader,
    Menu,
    Loading,
    CategorySelector,
} from 'src/client/components'

import { useUser } from 'src/client/hooks'
import { isApiState, User } from 'src/types'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const maybeUser = useUser()
    if (isApiState(maybeUser)) {
        return <Loading />
    }

    const user = maybeUser as User
    const classDarkMode = user.darkMode ? 'wrapper--dark-mode' : ''

    return (
        <div className={`wrapper ${classDarkMode}`}>
            <AppHeader />
            <CategorySelector />
            <Menu />
            <main className="main">{prop.children}</main>
        </div>
    )
}
