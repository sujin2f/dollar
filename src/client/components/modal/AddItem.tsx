import React, { Fragment, useRef } from 'react'
import { Button, CategoryDatalist } from 'src/client/components'
import { useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { formatDate } from 'src/utils'

export const AddItem = (): JSX.Element => {
    const { addItem } = useItems()
    const date = useRef<HTMLInputElement>(null)
    const title = useRef<HTMLInputElement>(null)
    const debit = useRef<HTMLInputElement>(null)
    const credit = useRef<HTMLInputElement>(null)
    const categoryRef = useRef<HTMLInputElement>(null)

    const onClick = () => {
        if (!date.current?.value) {
            return
        }
        if (!title.current?.value) {
            return
        }
        if (!debit.current?.value && !credit.current?.value) {
            return
        }
        const item = {
            checked: true,
            originTitle: title.current?.value,
            date: date.current?.value,
            title: title.current?.value,
            debit: parseFloat(debit.current?.value || ''),
            credit: parseFloat(credit.current?.value || ''),
            category: categoryRef.current?.value || '',
        } as RawItem

        addItem({
            variables: {
                item,
            },
        })
    }

    return (
        <Fragment>
            <h1>Add Item</h1>
            <label>
                {TableHeader.Date}
                <input
                    type="date"
                    defaultValue={formatDate(new Date())}
                    ref={date}
                />
            </label>
            <label>
                {TableHeader.Title}
                <input type="text" ref={title} />
            </label>
            <label>
                {TableHeader.Debit}
                <div className="input-group">
                    <span className="input-group-label">$</span>
                    <input
                        type="number"
                        className="input-group-field"
                        ref={debit}
                    />
                </div>
            </label>
            <label>
                {TableHeader.Credit}
                <div className="input-group">
                    <span className="input-group-label">$</span>
                    <input
                        type="number"
                        className="input-group-field"
                        ref={credit}
                    />
                </div>
            </label>
            <label>
                {TableHeader.Category}
                <input type="text" list="category-list" ref={categoryRef} />
                <CategoryDatalist />
            </label>

            <Button onClick={onClick} autoFocus={true} title="Update" />
        </Fragment>
    )
}
