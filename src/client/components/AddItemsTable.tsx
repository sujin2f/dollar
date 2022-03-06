import React, { ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreateItems, useCategory, useGetPreItems } from 'src/client/hooks'
import { Column, CreateItemsParam } from 'src/types'
import { deepCopy } from 'src/utils'

export const AddItemsTable = (): JSX.Element => {
    const { categories } = useCategory()
    const createItems = useCreateItems()
    const [preItems, , resetPreItems] = useGetPreItems()
    const [tableData, changeTableData] = useState<CreateItemsParam[]>(
        preItems.preItemsDataset,
    )
    const [toggle, changeToggle] = useState<boolean>(true)

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
        const newTableData = deepCopy(tableData) as CreateItemsParam[]
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

    const onDebitChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(tableData) as CreateItemsParam[]
        newTableData[index].debit = e.target.value
        changeTableData(newTableData)
    }

    const onCreditChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(tableData) as CreateItemsParam[]
        newTableData[index].credit = e.target.value
        changeTableData(newTableData)
    }

    return (
        <div className="row">
            <div className="columns small-12">
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
                                    <td>{row.date}</td>
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
                                            defaultValue={row.category}
                                            onChange={(e) =>
                                                onCategoryChanged(e, index)
                                            }
                                            list="category-list"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            defaultValue={row.debit}
                                            onChange={(e) =>
                                                onDebitChanged(e, index)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            defaultValue={row.credit}
                                            onChange={(e) =>
                                                onCreditChanged(e, index)
                                            }
                                        />
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
                        onClick={() => createItems(tableData, true)}
                        className="button"
                    >
                        Submit
                    </Link>
                    <Link
                        to="#"
                        onClick={() => resetPreItems()}
                        className="button secondary"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    )
}
