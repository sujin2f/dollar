import React from 'react'
import { useCategory } from 'src/client/hooks'
import { Datalist } from 'src/client/components/form/Datalist'

export const CategoryDatalist = (): JSX.Element => {
    const { getRootCategories } = useCategory()

    return (
        <Datalist
            id="category-list"
            items={getRootCategories().map((category) => category.title)}
        />
    )
}
