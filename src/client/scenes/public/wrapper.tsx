/*
 * Public Wrapper Component
 */

import React, { PropsWithChildren } from 'react'
import { PublicHeader, Callout } from 'src/client/components'

import 'src/assets/styles/style.scss'
import { useGlobalOption } from 'src/client/hooks'

export const Wrapper = (prop: PropsWithChildren<{}>): JSX.Element => {
    const { callOutMessage, closeCallout } = useGlobalOption()
    return (
        <div className="wrapper wrapper--public">
            <Callout message={callOutMessage || ''} onClick={closeCallout} />
            <PublicHeader />
            {prop.children}
        </div>
    )
}
