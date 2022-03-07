import React, { PropsWithChildren } from 'react'
import {
    AppHeader,
    Menu,
    Loading,
    CategorySelector,
} from 'src/client/components'

import { useUser } from 'src/client/hooks'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const { user } = useUser()

    if (!user) {
        return <Loading />
    }

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
