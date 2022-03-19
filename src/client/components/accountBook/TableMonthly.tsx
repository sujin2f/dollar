import React from 'react'
import { useAccountBookMatch, useItems } from 'src/client/hooks'
import { TableHeader } from 'src/types/table'
import { formatCurrency } from 'src/utils/number'
import { Loading } from '../Loading'

export const TableMonthly = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const { loading, itemsToTableData } = useItems(year, month, type)

    if (loading) {
        return <Loading />
    }

    const { totalCredit, totalDebit, items } = itemsToTableData()

    return (
        <table className="table unstriped">
            <thead>
                <tr>
                    <th>{TableHeader.Date}</th>
                    <th className="table__cell--right">{TableHeader.Debit}</th>
                    <th className="table__cell--right">{TableHeader.Credit}</th>
                    <th className="table__cell--right">
                        {TableHeader.Subtotal}
                    </th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.date}>
                        <td>{item.date}</td>
                        <td className="table__cell--right">
                            {item.debit ? formatCurrency(item.debit) : ''}
                        </td>
                        <td className="table__cell--right">
                            {item.credit ? formatCurrency(item.credit) : ''}
                        </td>
                        <td className="table__cell--right">
                            {item.credit
                                ? formatCurrency(item.credit - item.debit)
                                : ''}
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <th>Total</th>
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
    )
}
