/*
 * Public Wrapper Component
 */

import React, { Fragment, useContext, useState, useEffect } from 'react'

import { Context, ContextType } from 'src/client/store'
import {
    AddItemForm,
    Header,
    RemovePopup,
    TimeLine,
} from 'src/client/components'

import 'src/assets/styles/style.scss'
import { useUser } from '../hooks'
import { getNextMidnight } from 'src/utils/datetime'

export const Public = (): JSX.Element => {
    const user = useUser()
    const [{ removePopup }] = useContext(Context) as ContextType
    const classPublic = !user ? 'wrapper--public' : ''
    const classDarkMode = user?.darkMode ? 'wrapper--dark-mode' : ''
    const [refreshTime, setRefreshTime] = useState(getNextMidnight())

    useEffect(() => {
        const toMidnight = refreshTime - new Date().getTime()
        setTimeout(() => {
            setRefreshTime(getNextMidnight())
        }, toMidnight)
    }, [refreshTime])

    return (
        <Fragment>
            {/* Profile image preload */}
            {user?.photo && <link rel="preload" as="image" href={user.photo} />}

            <div className={`wrapper ${classPublic} ${classDarkMode}`}>
                {removePopup && <RemovePopup />}
                <Header />
                <AddItemForm />
                <TimeLine />
            </div>
        </Fragment>
    )
}
