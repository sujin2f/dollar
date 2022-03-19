import React from 'react'

type Props = {
    id: string
    items: string[]
}
export const Datalist = (props: Props): JSX.Element => {
    const { id, items } = props

    return (
        <datalist id={id}>
            {items.map((item, index) => (
                <option key={`${id}-datalist-${index}`}>{item}</option>
            ))}
        </datalist>
    )
}
