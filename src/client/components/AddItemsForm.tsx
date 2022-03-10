import React, {
    Dispatch,
    SetStateAction,
    FormEvent,
    useRef,
    Fragment,
} from 'react'
import { RawItem } from 'src/types/model'
import { rawTextToRawItem } from 'src/client/utils/item'

type Props = {
    changeInput: Dispatch<SetStateAction<RawItem[]>>
}
export const AddItemsForm = (props: Props): JSX.Element => {
    const rawTextField = useRef<HTMLTextAreaElement>(null)
    const dateFormatField = useRef<HTMLSelectElement>(null)

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const dateFormat = dateFormatField.current?.value || ''
        const text = rawTextField.current?.value || ''
        props.changeInput(rawTextToRawItem(text, dateFormat))
    }

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

            <button className="button primary" onClick={(e) => onSubmit(e)}>
                Submit
            </button>
        </Fragment>
    )
}
