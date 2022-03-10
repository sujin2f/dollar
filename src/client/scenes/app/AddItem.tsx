import React, { Fragment, useRef } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { CategoryDatalist } from 'src/client/components'
import { useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { formatDate } from 'src/utils'

export const AddItem = (): JSX.Element => {
    const match = useRouteMatch<{ itemId?: string }>()
    const isModify = match.params?.itemId

    const { items, addItems } = useItems()
    const date = useRef<HTMLInputElement>(null)
    const title = useRef<HTMLInputElement>(null)
    const debit = useRef<HTMLInputElement>(null)
    const credit = useRef<HTMLInputElement>(null)
    const categoryRef = useRef<HTMLInputElement>(null)

    const currentItem = items.filter((v) => v._id === isModify)[0]

    const onClickSave = () => {
        if (!date.current?.value) {
            return
        }
        if (!title.current?.value) {
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
        if (isModify) {
            item._id = currentItem._id
        }
        addItems({
            variables: {
                items: [item],
            },
        })
    }

    return (
        <Fragment>
            <h1>{isModify ? 'Modify Item' : 'Add Item'}</h1>
            <label>
                {TableHeader.Date}
                <input
                    type="date"
                    defaultValue={
                        isModify ? currentItem.date : formatDate(new Date())
                    }
                    ref={date}
                />
            </label>
            <label>
                {TableHeader.Title}
                <input
                    type="text"
                    ref={title}
                    defaultValue={isModify ? currentItem.title : ''}
                />
            </label>
            <label>
                {TableHeader.Debit}
                <div className="input-group">
                    <span className="input-group-label">$</span>
                    <input
                        type="number"
                        className="input-group-field"
                        defaultValue={isModify ? currentItem.debit : ''}
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
                        defaultValue={isModify ? currentItem.credit : ''}
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
                    defaultValue={isModify ? currentItem.category?.title : ''}
                />
                <CategoryDatalist />
            </label>

            <div className="button-group">
                <Link to="#" className="button" onClick={() => onClickSave()}>
                    Save
                </Link>
                <Link to="/app" className="button secondary">
                    Cancel
                </Link>
            </div>
        </Fragment>
    )
}
