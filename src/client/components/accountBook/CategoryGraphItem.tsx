import React from 'react'
import { BW } from 'src/constants/color'
import { useCategory } from 'src/client/hooks'
import { CategoryMeta } from './CategoryGraph'

type Props = {
    meta: CategoryMeta
    percent: number
}
export const CategoryGraphItem = (props: Props): JSX.Element => {
    const { getCategoryByTitle } = useCategory()

    return (
        <div
            className="category-graph__item"
            style={{
                width: `${props.percent}%`,
                backgroundColor:
                    getCategoryByTitle(props.meta.category.title)?.color ||
                    BW.BLACK,
            }}
        />
    )
}
