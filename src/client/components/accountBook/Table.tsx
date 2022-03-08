import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAccountBookMatch, useCategory, useItems } from 'src/client/hooks'
import { Column } from 'src/types/table'
import { formatCurrency } from 'src/utils'
import { Loading } from '../Loading'

export const Table = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const { isCategoryHidden } = useCategory()
    const { loading, items } = useItems(year, month, type)
    const history = useHistory()
    if (loading) {
        return <Loading />
    }

    let totalDebit = 0
    let totalCredit = 0

    items.forEach((item) => {
        if (!isCategoryHidden(item.category?._id)) {
            totalDebit += item.debit
            totalCredit += item.credit
        }
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
                        {items
                            .filter(
                                (item) => !isCategoryHidden(item.category?._id),
                            )
                            .map((item) => (
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
                                                to={`/app/update/${item._id}`}
                                                className="button tiny secondary hollow"
                                            >
                                                <i className="fi-wrench" />
                                            </Link>
                                            <Link
                                                to="#"
                                                className="button tiny secondary hollow"
                                                onClick={() => {
                                                    const addressRemove =
                                                        '/' +
                                                        [
                                                            'app',
                                                            type,
                                                            year,
                                                            month,
                                                            'remove',
                                                            item._id,
                                                        ]
                                                            .filter((v) => v)
                                                            .join('/')

                                                    history.push(addressRemove)
                                                }}
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
