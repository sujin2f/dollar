import React, {
    Dispatch,
    Fragment,
    RefObject,
    SetStateAction,
    useRef,
} from 'react'

type Props = {
    dateFormatField: RefObject<HTMLSelectElement>
    updateRawText: Dispatch<SetStateAction<string>>
}

export const AddItemsForm = (props: Props): JSX.Element => {
    const { dateFormatField, updateRawText } = props
    const rawTextField = useRef<HTMLTextAreaElement>(null)

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
                    const text = rawTextField.current?.value || ''
                    updateRawText(text)
                }}
            >
                Submit
            </button>
        </Fragment>
    )
}
