import React, { PropsWithChildren } from 'react'

export const Row = (
    props: PropsWithChildren<{ className?: string }>,
): JSX.Element => {
    return <div className={`row ${props.className}`}>{props.children}</div>
}
