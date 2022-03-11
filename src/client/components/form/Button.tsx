import React, { FormEvent } from 'react'

type Props = {
    title?: string
    className?: string
    onClick: (e: FormEvent) => void
    autoFocus?: boolean
}

export const Button = (props: Props): JSX.Element => {
    const className = props.className || 'primary'
    const title = props.title || 'Submit'

    return (
        <button
            className={`button ${className}`}
            onClick={(e) => props.onClick(e)}
            autoFocus={props.autoFocus}
        >
            {title}
        </button>
    )
}
