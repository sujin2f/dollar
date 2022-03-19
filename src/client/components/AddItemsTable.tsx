import React, {
    ChangeEvent,
    useState,
    Dispatch,
    SetStateAction,
    Fragment,
} from 'react'
import { Link } from 'react-router-dom'
import { useItems } from 'src/client/hooks'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { deepCopy } from 'src/utils/array'
import { CategoryDatalist } from 'src/client/components'

type Props = {
    items: RawItem[]
    changeInput: Dispatch<SetStateAction<RawItem[]>>
}
export const AddItemsTable = (props: Props): JSX.Element => {
    const { addItems } = useItems()
    const [items, changeItems] = useState<RawItem[]>(props.items)
    const [toggle, changeToggle] = useState<boolean>(true)

    const onToggleBoxClick = (): void => {
        changeToggle(!toggle)
        let checked = false
        if (!toggle) {
            checked = true
        }
        const newTableData = items.map((row) => ({
            ...row,
            checked,
        }))
        changeItems(newTableData)
    }

    const onCheckboxClick = (index: number): void => {
        const newTableData = deepCopy(items) as RawItem[]
        newTableData[index].checked = !newTableData[index].checked
        changeItems(newTableData)
    }

    const onTitleChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(items) as RawItem[]
        newTableData[index].title = e.target.value
        changeItems(newTableData)
    }

    const onCategoryChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(items) as RawItem[]
        newTableData[index].category = e.target.value
        changeItems(newTableData)
    }

    const onDebitChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(items) as RawItem[]
        newTableData[index].debit = parseFloat(e.target.value)
        changeItems(newTableData)
    }

    const onCreditChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = deepCopy(items) as RawItem[]
        newTableData[index].credit = parseFloat(e.target.value)
        changeItems(newTableData)
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
                        <th>{TableHeader.Date}</th>
                        <th>{TableHeader.Title}</th>
                        <th>{TableHeader.Category}</th>
                        <th>{TableHeader.Debit}</th>
                        <th>{TableHeader.Credit}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((row, index) => {
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

            <CategoryDatalist />

            <div className="button-group">
                <Link
                    to="#"
                    onClick={() =>
                        addItems({
                            variables: {
                                items: items
                                    .filter((v) => v.checked)
                                    .map((v) => ({
                                        date: v.date,
                                        category: v.category,
                                        originTitle: v.originTitle,
                                        title: v.title,
                                        debit: v.debit,
                                        credit: v.credit,
                                    })),
                            },
                        })
                    }
                    className="button"
                >
                    Submit
                </Link>
                <Link
                    to="#"
                    onClick={() => props.changeInput([])}
                    className="button secondary"
                >
                    Cancel
                </Link>
            </div>
        </Fragment>
    )
}
