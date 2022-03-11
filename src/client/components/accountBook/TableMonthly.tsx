import React from 'react'
import { useAccountBookMatch, useCategory, useItems } from 'src/client/hooks'
import { TableHeader } from 'src/types/table'
import { formatCurrency } from 'src/utils'
import { Loading } from '../Loading'

export const TableMonthly = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const { isCategoryHidden } = useCategory()
    const { loading, items } = useItems(year, month, type)

    if (loading) {
        return <Loading />
    }

    let totalDebit = 0
    let totalCredit = 0
    const rows: {
        date: string
        debit: number
        credit: number
    }[] = []

    items.forEach((item) => {
        if (isCategoryHidden(item.category?._id)) {
            return
        }

        totalDebit += item.debit
        totalCredit += item.credit
        const monthString = item.date.substring(5, 7)
        const existing = rows[parseInt(monthString, 10)] || {}
        rows[parseInt(monthString, 10)] = {
            date: item.date,
            debit: item.debit + (existing.debit || 0),
            credit: item.credit + (existing.credit || 0),
        }
    })

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
                {rows.map((row) => (
                    <tr key={row.date}>
                        <td>{row.date}</td>
                        <td className="table__cell--right">
                            {row.debit ? formatCurrency(row.debit) : ''}
                        </td>
                        <td className="table__cell--right">
                            {row.credit ? formatCurrency(row.credit) : ''}
                        </td>
                        <td className="table__cell--right">
                            {row.credit
                                ? formatCurrency(row.credit - row.debit)
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
