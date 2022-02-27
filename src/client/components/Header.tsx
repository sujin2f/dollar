import React, { Fragment, useContext } from 'react'

import { Context, ContextType } from 'src/client/store'

import { HeaderBanner, HeaderUser } from '.'

export const Header = (): JSX.Element => {
    const [{ user }] = useContext(Context) as ContextType
    return (
        <Fragment>
            {!user && <HeaderBanner />}
            {user && <HeaderUser user={user} />}
        </Fragment>
    )
}
