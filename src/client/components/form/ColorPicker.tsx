import React, { CSSProperties, useState } from 'react'
import { SwatchesPicker } from 'react-color'

type Props = {
    color?: string
    label?: string
    onChange?: (value: string) => void
}

export const ColorPicker = (props: Props): JSX.Element => {
    const [activated, changeActivated] = useState(false)
    const { color, onChange, label } = props

    const styleColor: CSSProperties = {
        background: color,
    }

    return (
        <div className="color-picker">
            <div
                className="color-picker__label"
                onClick={() => changeActivated(!activated)}
            >
                {label}
            </div>
            <div
                onClick={() => changeActivated(!activated)}
                className="color-picker__swatch"
                style={styleColor}
            />
            {activated ? (
                <div className="color-picker__popover">
                    <div
                        onClick={() => changeActivated(false)}
                        className="color-picker__cover"
                    />
                    <SwatchesPicker
                        color={color}
                        onChangeComplete={
                            /* istanbul ignore next */ (value) => {
                                changeActivated(false)
                                if (onChange) {
                                    onChange(value.hex)
                                }
                            }
                        }
                    />
                </div>
            ) : null}
        </div>
    )
}
