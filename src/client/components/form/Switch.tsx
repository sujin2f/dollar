import React, { Fragment, CSSProperties } from 'react'
import { Fn } from 'src/types/common'

type Props = {
    id: string
    checked: boolean
    title: string
    onChange: Fn<[void], void>
    style?: CSSProperties
}
export const Switch = (props: Props): JSX.Element => {
    const { id, checked, title, onChange, style } = props

    return (
        <Fragment>
            <input
                className="switch-input"
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => onChange()}
            />
            <label className="switch-paddle" htmlFor={id} style={style}>
                <span className="show-for-sr">
                    <span className="hidden">{title}</span>
                </span>
            </label>
        </Fragment>
    )
}
