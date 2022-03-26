import React, { Fragment } from 'react'
import { CategoryGraphTr } from './CategoryGraphTr'
import { CategoryMeta, CategoryMetaObject } from './CategoryGraph'

type Props = {
    categoryMeta: CategoryMeta[]
    categoryMetaObject: CategoryMetaObject
    totalDebit: number
}
export const CategoryGraphTable = (props: Props): JSX.Element => {
    const { categoryMeta, totalDebit, categoryMetaObject } = props

    return (
        <table className="table table__category-amount">
            <tbody className="table table__category-amount__tbody">
                {categoryMeta
                    .filter((meta) => !meta.category.parent)
                    .map((meta) => {
                        const percent = (meta.parentalTotal * 100) / totalDebit
                        return (
                            <Fragment
                                key={`category-amount-${meta.category.title}`}
                            >
                                <CategoryGraphTr
                                    meta={meta}
                                    percent={percent}
                                />

                                {meta.category.children &&
                                    meta.category.children.map((child) => {
                                        const childMeta =
                                            categoryMetaObject[child._id]
                                        if (!childMeta.total) {
                                            return <Fragment></Fragment>
                                        }
                                        const childPercent =
                                            (childMeta.total * 100) / totalDebit
                                        return (
                                            <CategoryGraphTr
                                                meta={childMeta}
                                                percent={childPercent}
                                                key={`category-amount-children-${childMeta.category.title}`}
                                                title={`${meta.category.title} : ${childMeta.category.title}`}
                                            />
                                        )
                                    })}
                            </Fragment>
                        )
                    })}
            </tbody>
        </table>
    )
}
