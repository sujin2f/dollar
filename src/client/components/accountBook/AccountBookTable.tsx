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

export const AccountBookTable = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const [, setDeleteItemModal] = useDeleteItemModal()

    const maybeItems = useItems(year, month, type)
    if (isApiState(maybeItems)) {
        return <Loading />
    }

    const items = maybeItems as Item[]

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
                                <td>
                                    {item.categories.map((category) => (
                                        <span
                                            className="label primary"
                                            key={`item-${item._id}-category-${category._id}`}
                                        >
                                            {category.title}
                                        </span>
                                    ))}
                                </td>
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
                                            to="#"
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
                </table>
            </div>
        </div>
    )
}
