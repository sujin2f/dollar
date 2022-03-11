import React, { PropsWithChildren } from 'react'
import {
    AppHeader,
    Menu,
    Loading,
    CategorySelector,
    Callout,
} from 'src/client/components'

import { useUser } from 'src/client/hooks'

import 'src/assets/styles/style.scss'
export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const { loading, user } = useUser()

    if (loading || !user) {
        return <Loading />
    }

    const classDarkMode = user.darkMode ? 'wrapper--dark-mode' : ''

    return (
        <div className={`wrapper ${classDarkMode}`}>
            <Callout />
            <AppHeader />
            <CategorySelector />
            <Menu />
            <main className="main">{prop.children}</main>
        </div>
    )
}
