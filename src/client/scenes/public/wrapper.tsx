/*
 * Public Wrapper Component
 */

import React, { PropsWithChildren } from 'react'
import { PublicHeader, Callout } from 'src/client/components'

import 'src/assets/styles/style.scss'

export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    return (
        <div className="wrapper wrapper--public">
            <Callout />
            <PublicHeader />
            {prop.children}
        </div>
    )
}
