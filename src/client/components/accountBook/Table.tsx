import React from 'react'
import { Link } from 'react-router-dom'
import {
    useAccountBookMatch,
    useCategory,
    useGlobalOption,
    useItems,
} from 'src/client/hooks'
import { TableHeader } from 'src/types/table'
import { formatCurrency } from 'src/utils'
import { Loading } from '../Loading'

export const Table = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const { isCategoryHidden } = useCategory()
    const { loading, items } = useItems(year, month, type)
    const { setDeleteModal, setUpdateModal } = useGlobalOption()

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
        <table className="table unstriped">
            <thead>
                <tr>
                    <th>{TableHeader.Date}</th>
                    <th>{TableHeader.Title}</th>
                    <th>{TableHeader.Category}</th>
                    <th className="table__cell--right">{TableHeader.Debit}</th>
                    <th className="table__cell--right">{TableHeader.Credit}</th>
                    <th className="table__cell--center">Action</th>
                </tr>
            </thead>
            <tbody>
                {items
                    .filter((item) => !isCategoryHidden(item.category?._id))
                    .map((item) => (
                        <tr key={item._id}>
                            <td>{item.date}</td>
                            <td>{item.title.toLowerCase()}</td>
                            <td>{item.category?.title || ''}</td>
                            <td className="table__cell--right">
                                {item.debit ? formatCurrency(item.debit) : ''}
                            </td>
                            <td className="table__cell--right">
                                {item.credit ? formatCurrency(item.credit) : ''}
                            </td>
                            <td className="table__cell--center">
                                <div className="button-group">
                                    <Link
                                        to="#"
                                        className="button tiny secondary hollow"
                                        onClick={() => setUpdateModal(item)}
                                    >
                                        <i className="fi-wrench" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="button tiny secondary hollow"
                                        onClick={() => setDeleteModal(item)}
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
                    <td className="table__cell--right">
                        {formatCurrency(totalCredit - totalDebit)}
                    </td>
                    <td></td>
                    <td className="table__cell--right">
                        {formatCurrency(totalDebit)}
                    </td>
                    <td className="table__cell--right">
                        {formatCurrency(totalCredit)}
                    </td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    )
}
