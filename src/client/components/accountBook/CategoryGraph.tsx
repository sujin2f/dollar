import React, { Fragment, useState } from 'react'
import { useAccountBookMatch, useCategory, useItems } from 'src/client/hooks'
import { Category } from 'src/types/model'
import { CategoryGraphItem } from './CategoryGraphItem'
import { CategoryGraphTable } from './CategoryGraphTable'

export type CategoryMeta = {
    category: Category
    total: number
    parentalTotal: number
}
export type CategoryMetaObject = {
    [categoryId: string]: CategoryMeta
}
export const CategoryGraph = (): JSX.Element => {
    const { year, month, type } = useAccountBookMatch()
    const [showTable, changeShowTable] = useState<boolean>(false)
    const { categories } = useCategory()
    const { items } = useItems(year, month, type)

    let totalDebit = 0
    const categoryMetaObject: CategoryMetaObject = categories.reduce(
        (acc, category) => {
            return {
                ...acc,
                [category._id]: {
                    category,
                    total: 0,
                    parentalTotal: 0,
                },
            }
        },
        {},
    )
    categoryMetaObject[''] = {
        category: {
            _id: 'uncategorised',
            title: 'Uncategorised',
            disabled: false,
        },
        total: 0,
        parentalTotal: 0,
    }

    items.forEach((item) => {
        if (item.category?.disabled) {
            return
        }

        totalDebit += item.debit

        if (item.debit) {
            const categoryId = item.category?._id || ''
            categoryMetaObject[categoryId].total += item.debit
            categoryMetaObject[categoryId].parentalTotal += item.debit
            if (item.category?.parent) {
                categoryMetaObject[item.category.parent].parentalTotal +=
                    item.debit
            }
        }
    })

    const categoryMeta: CategoryMeta[] = Object.values(categoryMetaObject)
        .filter((meta) => meta.parentalTotal)
        .sort((f, s) => s.parentalTotal - f.parentalTotal)

    return (
        <Fragment>
            <div onClick={() => changeShowTable(!showTable)}>
                <div className="category-graph category-graph__parent">
                    {categoryMeta
                        .filter((meta) => !meta.category.parent)
                        .map((meta) => {
                            const percent =
                                (meta.parentalTotal * 100) / totalDebit
                            return (
                                <CategoryGraphItem
                                    key={`category-graph-${meta.category.title}`}
                                    meta={meta}
                                    percent={percent}
                                />
                            )
                        })}
                </div>
                <div className="category-graph category-graph__children">
                    {categoryMeta
                        .filter((meta) => !meta.category.parent)
                        .map((meta) => {
                            const percent = (meta.total * 100) / totalDebit
                            return (
                                <Fragment
                                    key={`category-graph-children-${meta.category.title}`}
                                >
                                    {!!percent && (
                                        <CategoryGraphItem
                                            meta={meta}
                                            percent={percent}
                                        />
                                    )}
                                    {meta.category.children &&
                                        meta.category.children.map((child) => {
                                            const childMeta =
                                                categoryMetaObject[child._id]
                                            if (!childMeta.total) {
                                                return <Fragment></Fragment>
                                            }
                                            const childPercent =
                                                (childMeta.total * 100) /
                                                totalDebit
                                            return (
                                                <CategoryGraphItem
                                                    key={`category-graph-children-${childMeta.category.title}`}
                                                    meta={childMeta}
                                                    percent={childPercent}
                                                />
                                            )
                                        })}
                                </Fragment>
                            )
                        })}
                </div>
            </div>

            {showTable && (
                <CategoryGraphTable
                    categoryMeta={categoryMeta}
                    categoryMetaObject={categoryMetaObject}
                    totalDebit={totalDebit}
                />
            )}
        </Fragment>
    )
}
