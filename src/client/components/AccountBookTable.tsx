import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useItems } from 'src/client/hooks'
import { Column, isApiState, Item } from 'src/types'
import { formatDate, formatCurrency } from 'src/utils'

export const AccountBookTable = (): JSX.Element => {
    const maybeItems = useItems()
    if (isApiState(maybeItems)) {
        // TODO Loading
        return <Fragment />
    }
    const items = maybeItems as Item[]

    return (
        <Fragment>
            <table className="table unstriped">
                <thead>
                    <tr>
                        <th>{Column.Date}</th>
                        <th>{Column.Title}</th>
                        <th>{Column.Category}</th>
                        <th>{Column.Debit}</th>
                        <th>{Column.Credit}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td>{formatDate(item.date)}</td>
                            <td>{item.title.toLowerCase()}</td>
                            <td>{item.category && item.category.title}</td>
                            <td className="table__currency">
                                {item.debit !== 0 && formatCurrency(item.debit)}
                            </td>
                            <td className="table__currency">
                                {item.credit !== 0 &&
                                    formatCurrency(item.credit)}
                            </td>
                            <td>
                                <div className="button-group">
                                    <Link to="#" className="button small">
                                        <i className="fi-wrench" />
                                    </Link>
                                    <Link to="#" className="button small">
                                        <i className="fi-x" />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    )
}
