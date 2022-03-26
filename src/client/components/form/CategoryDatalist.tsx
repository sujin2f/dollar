import React from 'react'
import { useCategory } from 'src/client/hooks'
import { Datalist } from 'src/common/components/forms/Datalist'

export const CategoryDatalist = (): JSX.Element => {
    const { getRootCategories } = useCategory()

    return (
        <Datalist
            id="category-list"
            values={getRootCategories().map((category) => category.title)}
        />
    )
}
