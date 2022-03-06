import React from 'react'
import { Link } from 'react-router-dom'
import {
    useAccountBookMatch,
    useDeleteItemModal,
    useItems,
} from 'src/client/hooks'
import { Column, isApiState, Item } from 'src/types'
import { formatCurrency } from 'src/utils'
import { Loading } from '..'

export const Table = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const [, setDeleteItemModal] = useDeleteItemModal()

    const maybeItems = useItems(year, month, type)
    if (isApiState(maybeItems)) {
        return <Loading />
    }

    const items = maybeItems as Item[]
    let totalDebit = 0
    let totalCredit = 0

    items.forEach((item) => {
        totalDebit += item.debit
        totalCredit += item.credit
    })

    return (
        <div className="row">
            <div className="columns small-12">
                <table className="table unstriped">
                    <thead>
                        <tr>
                            <th>{Column.Date}</th>
                            <th>{Column.Title}</th>
                            <th>{Column.Category}</th>
                            <th className="table__cell--right">
                                {Column.Debit}
                            </th>
                            <th className="table__cell--right">
                                {Column.Credit}
                            </th>
                            <th className="table__cell--center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item._id}>
                                <td>{item.date}</td>
                                <td>{item.title.toLowerCase()}</td>
                                <td>{item.category?.title || ''}</td>
                                <td className="table__cell--right">
                                    {item.debit !== 0 &&
                                        formatCurrency(item.debit)}
                                </td>
                                <td className="table__cell--right">
                                    {item.credit !== 0 &&
                                        formatCurrency(item.credit)}
                                </td>
                                <td className="table__cell--center">
                                    <div className="button-group">
                                        <Link
                                            to={`/app/modify/${item._id}`}
                                            className="button tiny secondary hollow"
                                        >
                                            <i className="fi-wrench" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="button tiny secondary hollow"
                                            onClick={() =>
                                                setDeleteItemModal(item._id)
                                            }
                                        >
                                            <i className="fi-x" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td></td>
                            <td></td>
                            <td className="table__cell--right">
                                {formatCurrency(totalDebit)}
                            </td>
                            <td className="table__cell--right">
                                {formatCurrency(totalCredit)}
                            </td>
                            <td className="table__cell--right">
                                {formatCurrency(totalCredit - totalDebit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
