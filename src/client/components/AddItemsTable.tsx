import React, { Fragment, ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { createItems, useCategory, useGetPreItems } from 'src/client/hooks'
import { Category, Column, CreateItemsParam, isApiState } from 'src/types'
import { deepCopy, formatDate } from 'src/utils'

export const AddItemsTable = (): JSX.Element => {
    const maybeCategories = useCategory()
    const [preItems, , resetPreItems] = useGetPreItems()
    const [tableData, changeTableData] = useState<CreateItemsParam[]>(
        preItems.preItemsDataset,
    )
    const [toggle, changeToggle] = useState<boolean>(true)

    if (isApiState(maybeCategories)) {
        // TODO Loading
        return <Fragment />
    }

    const categories = maybeCategories as Category[]

    const onToggleBoxClick = (): void => {
        changeToggle(!toggle)
        let checked = false
        if (!toggle) {
            checked = true
        }
        const newTableData = tableData.map((row) => ({
            ...row,
            checked,
        }))
        changeTableData(newTableData)
    }

    const onCheckboxClick = (index: number): void => {
        const newTableData = [...tableData]
        newTableData[index].checked = !newTableData[index].checked
        changeTableData(newTableData)
    }

    const onTitleChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(tableData) as CreateItemsParam[]
        newTableData[index].title = e.target.value
        changeTableData(newTableData)
    }

    const onCategoryChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(tableData) as CreateItemsParam[]
        newTableData[index].category = e.target.value
        changeTableData(newTableData)
    }

    return (
        <Fragment>
            <table className="table unstriped">
                <thead>
                    <tr>
                        <th>
                            <div className="switch">
                                <input
                                    className="switch-input"
                                    id="toggle-all"
                                    type="checkbox"
                                    defaultChecked={toggle}
                                    onChange={() => onToggleBoxClick()}
                                />
                                <label
                                    className="switch-paddle"
                                    htmlFor="toggle-all"
                                >
                                    <span className="show-for-sr">
                                        <span className="hidden">
                                            Toggle Everything
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </th>
                        <th>{Column.Date}</th>
                        <th>{Column.Title}</th>
                        <th>{Column.Category}</th>
                        <th>{Column.Debit}</th>
                        <th>{Column.Credit}</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => {
                        return (
                            <tr key={`row-${index}`}>
                                <td>
                                    <div className="switch">
                                        <input
                                            className="switch-input"
                                            id={`include-${index}`}
                                            type="checkbox"
                                            checked={row.checked}
                                            onChange={() =>
                                                onCheckboxClick(index)
                                            }
                                        />
                                        <label
                                            className="switch-paddle"
                                            htmlFor={`include-${index}`}
                                        >
                                            <span className="show-for-sr">
                                                <span className="hidden">
                                                    Include this row
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    {row.date && formatDate(new Date(row.date))}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.title}
                                        onChange={(e) =>
                                            onTitleChanged(e, index)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.category}
                                        onChange={(e) =>
                                            onCategoryChanged(e, index)
                                        }
                                        list="category-list"
                                    />
                                </td>
                                <td className="table__currency">{row.debit}</td>
                                <td className="table__currency">
                                    {row.credit}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <datalist id="category-list">
                {categories.map((category) => (
                    <option key={`category-list-item-${category._id}`}>
                        {category.title}
                    </option>
                ))}
            </datalist>

            <div className="button-group">
                <Link
                    to="#"
                    onClick={() => createItems(tableData)}
                    className="button"
                >
                    Submit
                </Link>
                <Link
                    to="#"
                    onClick={() => resetPreItems()}
                    className="button hollow"
                >
                    Cancel
                </Link>
            </div>
        </Fragment>
    )
}
