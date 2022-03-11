import React, { Fragment, useRef } from 'react'
import { useGlobalOption, useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { CategoryDatalist } from 'src/client/components'
import { Button } from '../form/Button'

export const UpdateItem = (): JSX.Element => {
    const { updateItem } = useItems()
    const { updateItem: currentItem, closeModal } = useGlobalOption()

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
            _id: currentItem?._id,
            date: date.current?.value,
            title: title.current?.value,
            debit: parseFloat(debit.current?.value || ''),
            credit: parseFloat(credit.current?.value || ''),
            category: categoryRef.current?.value || '',
        } as RawItem

        updateItem({
            variables: {
                item,
            },
        })
        closeModal()
    }

    return (
        <Fragment>
            <h1>Update Item</h1>
            <label>
                {TableHeader.Date}
                <input
                    type="date"
                    defaultValue={currentItem?.date}
                    ref={date}
                />
            </label>
            <label>
                {TableHeader.Title}
                <input
                    type="text"
                    ref={title}
                    defaultValue={currentItem?.title}
                />
            </label>
            <label>
                {TableHeader.Debit}
                <div className="input-group">
                    <span className="input-group-label">$</span>
                    <input
                        type="number"
                        className="input-group-field"
                        defaultValue={currentItem?.debit}
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
                        defaultValue={currentItem?.credit}
                        ref={credit}
                    />
                </div>
            </label>
            <label>
                {TableHeader.Category}
                <input
                    type="text"
                    list="category-list"
                    ref={categoryRef}
                    defaultValue={currentItem?.category?.title}
                />
                <CategoryDatalist />
            </label>

            <Button onClick={onClick} autoFocus={true} title="Update" />
        </Fragment>
    )
}
