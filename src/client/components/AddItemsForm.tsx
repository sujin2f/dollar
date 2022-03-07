import React, { useRef } from 'react'
import { usePreItem } from 'src/client/hooks'

export const AddItemsForm = (): JSX.Element => {
    const { setPreItems } = usePreItem()
    const rawTextField = useRef<HTMLTextAreaElement>(null)
    const dateFormatField = useRef<HTMLSelectElement>(null)

    return (
        <div className="row">
            <div className="columns small-12">
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
            </div>
        </div>
    )
}
