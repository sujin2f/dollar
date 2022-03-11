import React, { FormEvent } from 'react'

type Props = {
    title?: string
    className?: string
    onClick: (e: FormEvent) => void
    autoFocus?: boolean
    icon?: string
}

export const Button = (props: Props): JSX.Element => {
    const className = props.className || 'primary'
    const title = props.title || 'Submit'

    return (
        <button
            className={`button ${className}`}
            onClick={(e) => props.onClick(e)}
            autoFocus={props.autoFocus}
            aria-label={title}
        >
            {props.icon && <i className={`fi-${props.icon}`} />}
            {!props.icon && title}
        </button>
    )
}
