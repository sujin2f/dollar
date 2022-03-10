import React, { PropsWithChildren } from 'react'

export const Row = (props: PropsWithChildren<{}>): JSX.Element => {
    return <div className="row">{props.children}</div>
}
