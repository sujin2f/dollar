import React, { Fragment, useRef } from 'react'
import { useGetPreItems } from 'src/client/hooks'

export const AddItemsForm = (): JSX.Element => {
    const [, setPreItems] = useGetPreItems()
    const rawTextField = useRef<HTMLTextAreaElement>(null)
    const dateFormatField = useRef<HTMLSelectElement>(null)

    return (
        <Fragment>
            <label htmlFor="select-date-format">
                Date Format
                <select ref={dateFormatField} id="select-date-format">
                    <option value="">Auto Detect</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
            </label>
            <textarea ref={rawTextField} defaultValue="" rows={12} />
            <button
                className="button primary"
                onClick={(e) => {
                    e.preventDefault()
                    const dateFormat = dateFormatField.current?.value || ''
                    const text = rawTextField.current?.value || ''
                    setPreItems(dateFormat, text)
                }}
            >
                Submit
            </button>
        </Fragment>
    )
}