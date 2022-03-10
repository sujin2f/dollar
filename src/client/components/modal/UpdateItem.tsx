import React, { Fragment, useRef } from 'react'
import { useGlobalOption, useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { CategoryDatalist } from 'src/client/components'

export const UpdateItem = (): JSX.Element => {
    const { updateItem } = useItems()
    const { updateModal, closeModal } = useGlobalOption()

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
            _id: updateModal?._id,
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
                    defaultValue={updateModal?.date}
                    ref={date}
                />
            </label>
            <label>
                {TableHeader.Title}
                <input
                    type="text"
                    ref={title}
                    defaultValue={updateModal?.title}
                />
            </label>
            <label>
                {TableHeader.Debit}
                <div className="input-group">
                    <span className="input-group-label">$</span>
                    <input
                        type="number"
                        className="input-group-field"
                        defaultValue={updateModal?.debit}
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
                        defaultValue={updateModal?.credit}
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
                    defaultValue={updateModal?.category?.title}
                />
                <CategoryDatalist />
            </label>

            <button className="button" onClick={() => onClick()} autoFocus>
                Update
            </button>
        </Fragment>
    )
}
