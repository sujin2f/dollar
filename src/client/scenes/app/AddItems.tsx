import React, { Fragment, useRef, useState } from 'react'
import { AddItemsForm, AddItemsTable } from 'src/client/components'

export const AddItems = (): JSX.Element => {
    const [rawText, updateRawText] = useState('')
    const dateFormatField = useRef<HTMLSelectElement>(null)

    return (
        <Fragment>
            {!rawText && (
                <AddItemsForm
                    dateFormatField={dateFormatField}
                    updateRawText={updateRawText}
                />
            )}
            {rawText && (
                <AddItemsTable
                    dateFormat={dateFormatField.current?.value || ''}
                    rawText={rawText}
                    updateRawText={updateRawText}
                />
            )}
        </Fragment>
    )
}
