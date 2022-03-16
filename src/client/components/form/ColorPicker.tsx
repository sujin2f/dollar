import React, { CSSProperties, useState } from 'react'
import { SwatchesPicker } from 'react-color'

import { Fn } from 'src/types/common'

type Props = {
    color: string
    label?: string
    onChange: Fn<[string], void>
}

export const ColorPicker = (props: Props): JSX.Element => {
    const [activated, changeActivated] = useState(false)
    const { color, onChange, label } = props

    const styleColor: CSSProperties = {
        background: color,
    }

    return (
        <div>
            <div
                onClick={() => changeActivated(!activated)}
                className="color-picker__swatch"
                style={styleColor}
            />
            <div
                className="color-picker__label"
                onClick={() => changeActivated(!activated)}
            >
                {label}
            </div>
            {activated ? (
                <div className="color-picker__popover">
                    <div
                        onClick={() => changeActivated(false)}
                        className="color-picker__cover"
                    />
                    <SwatchesPicker
                        color={color}
                        onChangeComplete={(value) => {
                            changeActivated(false)
                            onChange(value.hex)
                        }}
                    />
                </div>
            ) : null}
        </div>
    )
}
