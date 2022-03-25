import React, { Fragment, useRef, useState, ChangeEvent } from 'react'
import { Button, Datalist, Input } from 'src/client/components'
import { useCategory, useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { formatDate } from 'src/utils/datetime'

export const AddItem = (): JSX.Element => {
    const { addItem } = useItems()
    const { getSubCategories, getRootCategories, getCategoryByTitle } =
        useCategory()
    const [dateError, setDateError] = useState<string>('')
    const [titleError, setTitleError] = useState<string>('')
    const [amountError, setAmountError] = useState<string>('')
    const [subcategories, setSubcategories] = useState<string[]>([])
    const date = useRef<HTMLInputElement>(null)
    const title = useRef<HTMLInputElement>(null)
    const debit = useRef<HTMLInputElement>(null)
    const credit = useRef<HTMLInputElement>(null)
    const categoryRef = useRef<HTMLInputElement>(null)
    const subCategoryRef = useRef<HTMLInputElement>(null)

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

    const onCategoryChange = (e?: ChangeEvent) => {
        const category = getCategoryByTitle(categoryRef.current?.value || '')
        if (!category) {
            return
        }
        setSubcategories(getSubCategories(category._id).map((cat) => cat.title))
    }

    const onSubmit = () => {
        if (!validate()) {
            return
        }
        const rawItem = {
            checked: true,
            originTitle: title.current?.value,
            date: date.current?.value,
            title: title.current?.value,
            debit: parseFloat(debit.current?.value || ''),
            credit: parseFloat(credit.current?.value || ''),
            category: categoryRef.current?.value || '',
            subCategory: subCategoryRef.current?.value || '',
        } as RawItem

        addItem({
            variables: {
                rawItem,
                type: 'add',
            },
        })
    }

    return (
        <Fragment>
            <h1>Add Item</h1>
            <form onSubmit={onSubmit}>
                <Input
                    label={TableHeader.Date as string}
                    type="date"
                    defaultValue={formatDate(new Date())}
                    reference={date}
                    errorMessage={dateError}
                    onEnterKeyDown={onSubmit}
                    required
                />
                <Input
                    label={TableHeader.Title as string}
                    reference={title}
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
                />
                <Input
                    label={TableHeader.Credit as string}
                    reference={credit}
                    inlineLabel="$"
                    type="number"
                    errorMessage={amountError}
                    onEnterKeyDown={onSubmit}
                />
                <Input
                    label={TableHeader.Category as string}
                    reference={categoryRef}
                    list="category-list"
                    onEnterKeyDown={onSubmit}
                    onChange={(e) => onCategoryChange(e)}
                />
                <Datalist
                    id="category-list"
                    values={getRootCategories().map(
                        (category) => category.title,
                    )}
                />
                <Input
                    label={TableHeader.SubCategory as string}
                    reference={subCategoryRef}
                    list="sub-category-list"
                    onEnterKeyDown={onSubmit}
                />
                <Datalist id="sub-category-list" values={subcategories} />
            </form>
            <Button type="submit" title="Add Item" onClick={onSubmit} />
        </Fragment>
    )
}
