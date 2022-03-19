import React, { Fragment, useState } from 'react'
import { BW } from 'src/constants/color'
import { useAccountBookMatch, useCategory, useItems } from 'src/client/hooks'
import { formatCurrency } from 'src/utils/number'

export const CategoryGraph = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const [showTable, changeShowTable] = useState<boolean>(false)
    const { isCategoryHidden, getCategoryByTitle } = useCategory()

    const { items } = useItems(year, month, type)

    let totalDebit = 0
    const categoryDebit: Record<string, number> = {}

    items.forEach((item) => {
        if (!isCategoryHidden(item.category?._id)) {
            totalDebit += item.debit
        }

        if (
            item.debit &&
            item.category?.title &&
            !isCategoryHidden(item.category?._id)
        ) {
            categoryDebit[item.category.title] =
                categoryDebit[item.category.title] || 0
            categoryDebit[item.category.title] += item.debit
        }
    })

    const categoryDebitSort: { title: string; total: number }[] = Object.keys(
        categoryDebit,
    )
        .map((category) => ({
            title: category,
            total: categoryDebit[category],
        }))
        .sort((f, s) => s.total - f.total)

    return (
        <Fragment>
            <div
                className="category-graph"
                onClick={() => changeShowTable(!showTable)}
            >
                {categoryDebitSort.map((category) => {
                    const percent = (category.total * 100) / totalDebit
                    return (
                        <div
                            key={`category-graph-${category.title}`}
                            className="category-graph__item"
                            style={{
                                width: `${percent}%`,
                                backgroundColor:
                                    getCategoryByTitle(category.title)?.color ||
                                    BW.BLACK,
                            }}
                        />
                    )
                })}
            </div>

            {showTable && (
                <table className="table table__category-amount">
                    <tbody className="table table__category-amount__tbody">
                        {categoryDebitSort.map((category) => {
                            const percent = (category.total * 100) / totalDebit
                            return (
                                <tr
                                    key={`category-amount-${category.title}`}
                                    className="category-amount__item"
                                >
                                    <td>
                                        <div
                                            className="category-amount__chip"
                                            style={{
                                                backgroundColor:
                                                    getCategoryByTitle(
                                                        category.title,
                                                    )?.color || BW.BLACK,
                                            }}
                                        />
                                    </td>
                                    <td>{category.title}</td>
                                    <td>{formatCurrency(category.total)}</td>
                                    <td>{percent.toFixed(2)}%</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </Fragment>
    )
}
