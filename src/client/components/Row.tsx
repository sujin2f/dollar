import React, { PropsWithChildren } from 'react'

export const Row = (
    props: PropsWithChildren<{ className?: string }>,
): JSX.Element => {
    const { className } = props
    return <div className={`row ${className || ''}`}>{props.children}</div>
}
