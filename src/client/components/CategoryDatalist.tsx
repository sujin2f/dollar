import React from 'react'
import { useCategory } from 'src/client/hooks'

export const CategoryDatalist = (): JSX.Element => {
    const { categories } = useCategory()

    return (
        <datalist id="category-list">
            {categories.map((category) => (
                <option key={`category-list-item-${category._id}`}>
                    {category.title}
                </option>
            ))}
        </datalist>
    )
}
