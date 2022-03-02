/*
 * Public Wrapper Component
 */

import React, { PropsWithChildren } from 'react'
import { PublicHeader } from 'src/client/components'

import 'src/assets/styles/style.scss'

export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    return (
        <div className="wrapper wrapper--public">
            <PublicHeader />
            {prop.children}
        </div>
    )
}
