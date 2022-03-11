import React, { Fragment, KeyboardEvent, RefObject, useRef } from 'react'
import { removeEmpty } from 'src/utils/object'

type Props = {
    label?: string
    id?: string
    type?: string
    defaultValue?: string | number
    reference?: RefObject<HTMLInputElement>
    helpText?: string
    required?: boolean
    errorMessage?: string
    inlineLabel?: string
    list?: string
    onEnterKeyDown?: () => void
    autoFocus?: boolean
}
export const Input = (props: Props): JSX.Element => {
    const {
        label,
        defaultValue,
        reference,
        helpText,
        required,
        errorMessage,
        inlineLabel,
        list,
        autoFocus,
        onEnterKeyDown,
    } = props

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = reference || useRef<HTMLInputElement>(null)

    const id = props.id || crypto.randomUUID()
    const type = props.type || 'text'
    const ariaDescribedby = helpText ? `${id}-help-text` : ''
    const labelClassNames = `form-label ${
        required ? 'form-label--required' : ''
    }`
    const className = `${inlineLabel ? 'input-group-field' : ''} ${
        errorMessage ? 'input--error' : ''
    }`
    const inputProps = removeEmpty({
        id,
        type,
        defaultValue,
        ref,
        'aria-describedby': ariaDescribedby,
        required,
        className,
        list,
        autoFocus,
    })

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && onEnterKeyDown) {
            onEnterKeyDown()
        }
    }

    const inputComponent = (
        <Fragment>
            <input {...inputProps} onKeyDown={onKeyDown} />
            {helpText && (
                <p className="help-text" id={ariaDescribedby}>
                    {helpText}
                </p>
            )}
        </Fragment>
    )
    const labelComponent = (
        <Fragment>
            {label && (
                <label
                    htmlFor={id}
                    className={labelClassNames}
                    onClick={() => {
                        ref.current?.focus()
                    }}
                >
                    <span className="form-label__text">{label}</span>
                    {errorMessage && (
                        <span className="form-label__error">
                            {errorMessage}
                        </span>
                    )}
                </label>
            )}
        </Fragment>
    )

    if (inlineLabel) {
        return (
            <Fragment>
                {labelComponent}
                <div
                    className="input-group"
                    onClick={() => {
                        ref.current?.focus()
                    }}
                >
                    <span className="input-group-label">{inlineLabel}</span>
                    {inputComponent}
                </div>
            </Fragment>
        )
    }
    return (
        <Fragment>
            {labelComponent}
            {inputComponent}
        </Fragment>
    )
}
