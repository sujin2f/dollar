import React, {
    Fragment,
    Dispatch,
    SetStateAction,
    ChangeEvent,
    useState,
} from 'react'
import { Link } from 'react-router-dom'
import { createItems } from 'src/client/hooks/useItems'
import { Column, CreateItemsParam, Nullable } from 'src/types'
import { formatDate } from 'src/utils'

interface Props {
    dateFormat: string
    rawText: string
    updateRawText: Dispatch<SetStateAction<string>>
}

const rawTextToDataSet = (
    rawText: string,
    dateFormat: string,
): CreateItemsParam[] => {
    const tabSeparated = rawText.split('\n').map((row) => row.split('\t'))
    const columns: Column[] = []
    const result = []

    // Set columns
    if (tabSeparated[0][0]) {
        tabSeparated[0].forEach((text) => {
            if (Object.keys(Column).includes(text)) {
                columns.push(Column[text as keyof typeof Column])
            } else {
                columns.push(Column.Unknown)
            }
        })
    }

    for (const row of tabSeparated.splice(1)) {
        const rowData: Partial<Record<Column, string>> = {}
        row.forEach((column, key) => (rowData[columns[key]] = column))
        result.push(rowData)
    }

    return result
        .map((row) => {
            let date: Nullable<Date> = null
            switch (dateFormat) {
                case 'DD/MM/YYYY':
                    const dateString = row[Column.Date]?.split('/') || []
                    if (dateString.length !== 3) {
                        break
                    }
                    date = new Date(
                        `${dateString[2]}-${dateString[1]}-${dateString[0]}`,
                    )
                    break
                default:
                    date = new Date(Date.parse(row[Column.Date] || ''))
            }
            return {
                checked: true,
                date,
                title: row[Column.Title],
                originTitle: row[Column.Title],
                category: '',
                debit: row[Column.Debit],
                credit: row[Column.Credit],
            } as CreateItemsParam
        })
        .filter((row) => !row.date || row.date.toString() !== 'Invalid Date')
}

export const AddItemsTable = (props: Props): JSX.Element => {
    const { dateFormat, rawText, updateRawText } = props
    const initData = rawTextToDataSet(rawText, dateFormat)
    const [tableData, changeTableData] = useState<CreateItemsParam[]>(initData)
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
        const newTableData = [...tableData]
        newTableData[index].checked = !newTableData[index].checked
        changeTableData(newTableData)
    }

    const onTitleChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = [...tableData]
        newTableData[index].title = e.target.value
        changeTableData(newTableData)
    }

    const onCategoryChanged = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ): void => {
        const newTableData = [...tableData]
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
                                <td>{row.date && formatDate(row.date)}</td>
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
                    onClick={() => updateRawText('')}
                    className="button hollow"
                >
                    Cancel
                </Link>
            </div>
        </Fragment>
    )
}
