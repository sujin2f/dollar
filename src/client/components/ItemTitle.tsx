import React from 'react'

type Props = {
    title: string
}

export const ItemTitle = (props: Props): JSX.Element => {
    return <div className="timeline__item--title">{props.title}</div>
}
