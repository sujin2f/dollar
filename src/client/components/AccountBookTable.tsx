import React, { Fragment } from 'react'
import { useItems } from 'src/client/hooks'
import { isApiState, Item } from 'src/types'
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
                        <th>Date</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Debit</th>
                        <th>Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td>{formatDate(item.date)}</td>
                            <td>{item.title}</td>
                            <td>{item.category && item.category.title}</td>
                            <td className="table__currency">
                                {item.debit !== 0 && formatCurrency(item.debit)}
                            </td>
                            <td className="table__currency">
                                {item.credit !== 0 &&
                                    formatCurrency(item.credit)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    )
}
