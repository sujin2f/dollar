import React, { Fragment, RefObject, ChangeEvent } from 'react'

type Props = {
    options: string[]
    label?: string
    id?: string
    reference?: RefObject<HTMLSelectElement>
    defaultValue?: string
    value?: string
    onChange?: (e?: ChangeEvent<HTMLSelectElement>) => void
}

export const Select = (props: Props): JSX.Element => {
    const { reference, id, label, options, value, onChange } = props

    return (
        <Fragment>
            {label && <label htmlFor={id}>{label}</label>}
            <select ref={reference} id={id} onChange={onChange} value={value}>
                {options.map((text, index) => (
                    <option value={text} key={`option-${id}-${index}`}>
                        {text}
                    </option>
                ))}
            </select>
        </Fragment>
    )
}
