import React from 'react'
import { BW } from 'src/constants/color'
import { useCategory } from 'src/client/hooks'
import { formatCurrency } from 'src/utils/number'
import { CategoryMeta } from './CategoryGraph'

type Props = {
    meta: CategoryMeta
    percent: number
    title?: string
}
export const CategoryGraphTr = (props: Props): JSX.Element => {
    const { getCategoryByTitle } = useCategory()
    return (
        <tr className="category-amount__item">
            <td>
                <div
                    className="category-amount__chip"
                    style={{
                        backgroundColor:
                            getCategoryByTitle(props.meta.category.title)
                                ?.color || BW.BLACK,
                    }}
                />
            </td>
            <td>{props.title || props.meta.category.title}</td>
            <td>{formatCurrency(props.meta.parentalTotal)}</td>
            <td>{props.percent.toFixed(2)}%</td>
        </tr>
    )
}
