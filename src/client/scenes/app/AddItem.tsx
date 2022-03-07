import React, { useRef } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { useCategory, useItems } from 'src/client/hooks'
import { Column, CreateItemsParam } from 'src/types'

export const AddItem = (): JSX.Element => {
    const match = useRouteMatch<{ itemId?: string }>()
    const isModify = match.params?.itemId

    const { categories } = useCategory()
    const { items, createItems } = useItems()
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
            debit: debit.current?.value || '',
            credit: credit.current?.value || '',
            category: categoryRef.current?.value || '',
        } as CreateItemsParam
        if (isModify) {
            item._id = currentItem._id
        }
        createItems([item], false)
    }

    return (
        <div className="row">
            <div className="columns small-12 medium-6 medium-offset-3">
                <h1>{isModify ? 'Modify Item' : 'Add Item'}</h1>
                <label>
                    {Column.Date}
                    <input
                        type="date"
                        defaultValue={isModify ? currentItem.date : ''}
                        ref={date}
                    />
                </label>
                <label>
                    {Column.Title}
                    <input
                        type="text"
                        ref={title}
                        defaultValue={isModify ? currentItem.title : ''}
                    />
                </label>
                <label>
                    {Column.Debit}
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
                    {Column.Credit}
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
                    {Column.Category}
                    <input
                        type="text"
                        list="category-list"
                        ref={categoryRef}
                        defaultValue={
                            isModify ? currentItem.category?.title : ''
                        }
                    />
                    <datalist id="category-list">
                        {categories.map((category) => (
                            <option key={`category-list-item-${category._id}`}>
                                {category.title}
                            </option>
                        ))}
                    </datalist>
                </label>

                <div className="button-group">
                    <Link
                        to="#"
                        className="button"
                        onClick={() => onClickSave()}
                    >
                        Save
                    </Link>
                    <Link to="/app" className="button secondary">
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    )
}
