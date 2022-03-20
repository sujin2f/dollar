import React, { Fragment, useRef, useState } from 'react'
import { useGlobalOption, useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { CategoryDatalist, Input } from 'src/client/components'
import { Button } from '../form/Button'

export const UpdateItem = (): JSX.Element => {
    const { updateItem } = useItems()
    const { updateItem: currentItem } = useGlobalOption()
    const [dateError, setDateError] = useState<string>('')
    const [titleError, setTitleError] = useState<string>('')
    const [amountError, setAmountError] = useState<string>('')

    const date = useRef<HTMLInputElement>(null)
    const title = useRef<HTMLInputElement>(null)
    const debit = useRef<HTMLInputElement>(null)
    const credit = useRef<HTMLInputElement>(null)
    const categoryRef = useRef<HTMLInputElement>(null)

    const validate = () => {
        let validated = true
        setDateError('')
        setTitleError('')
        setAmountError('')

        if (!date.current?.value) {
            setDateError('Date is required.')
            validated = false
        }
        if (!title.current?.value) {
            setTitleError('Title is required.')
            validated = false
        }
        if (!debit.current?.value && !credit.current?.value) {
            setAmountError('Either debit or credit should be filled.')
            validated = false
        }

        return validated
    }

    const onSubmit = () => {
        if (!validate()) {
            return
        }
        const rawItem = {
            _id: currentItem?._id,
            date: date.current?.value,
            title: title.current?.value,
            debit: parseFloat(debit.current?.value || ''),
            credit: parseFloat(credit.current?.value || ''),
            category: categoryRef.current?.value || '',
        } as RawItem

        updateItem({
            variables: {
                rawItem,
                type: 'update',
            },
        })
    }

    return (
        <Fragment>
            <h1>Update Item</h1>
            <form onSubmit={onSubmit}>
                <Input
                    label={TableHeader.Date as string}
                    type="date"
                    defaultValue={currentItem?.date}
                    reference={date}
                    errorMessage={dateError}
                    onEnterKeyDown={onSubmit}
                    required
                />
                <Input
                    label={TableHeader.Title as string}
                    reference={title}
                    defaultValue={currentItem?.title}
                    errorMessage={titleError}
                    onEnterKeyDown={onSubmit}
                    required
                    autoFocus
                />
                <Input
                    label={TableHeader.Debit as string}
                    reference={debit}
                    inlineLabel="$"
                    type="number"
                    errorMessage={amountError}
                    onEnterKeyDown={onSubmit}
                    defaultValue={currentItem?.debit}
                />
                <Input
                    label={TableHeader.Credit as string}
                    reference={credit}
                    inlineLabel="$"
                    type="number"
                    errorMessage={amountError}
                    onEnterKeyDown={onSubmit}
                    defaultValue={currentItem?.credit}
                />
                <Input
                    label={TableHeader.Category as string}
                    reference={categoryRef}
                    list="category-list"
                    onEnterKeyDown={onSubmit}
                    defaultValue={currentItem?.category?.title}
                />
                <CategoryDatalist />
            </form>
            <Button type="submit" title="Update Item" onClick={onSubmit} />
        </Fragment>
    )
}
