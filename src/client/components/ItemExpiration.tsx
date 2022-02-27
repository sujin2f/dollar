import React from 'react'

type Props = {
    expiration: string
}

export const ItemExpiration = (props: Props): JSX.Element => {
    return <div className="timeline__item--expiration">{props.expiration}</div>
}
