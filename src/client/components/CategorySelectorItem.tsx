import React from 'react'

import { Icon } from 'src/common/components/containers/Icon'
import { Switch } from 'src/common/components/forms/Switch'
import { BW } from 'src/constants/color'
import { Category } from 'src/types/model'
import { useCategory, useGlobalOption } from '../hooks'

type Props = {
    category: Category
    isChild?: boolean
}
export const CategorySelectorItem = (props: Props): JSX.Element => {
    const { updateCategory } = useCategory()
    const { openCategoryEditor } = useGlobalOption()
    const { category, isChild } = props
    const className = isChild ? 'category-selector__item--child' : ''

    return (
        <div className={`category-selector__item ${className}`}>
            <Switch
                id={`category-selector-${category._id}`}
                checked={!category.disabled}
                onChange={(checked: boolean) => {
                    updateCategory({
                        variables: {
                            category: {
                                _id: category._id,
                                disabled: !checked,
                            },
                        },
                    })
                }}
                title={`Toggle ${category.title}`}
                style={{
                    backgroundColor: category.disabled
                        ? BW.GREY
                        : category.color || BW.BLACK,
                }}
            />
            <div
                className="category-selector__label"
                onClick={() => openCategoryEditor(category)}
            >
                {category.title}
                <Icon
                    icon="widget"
                    className="category-selector__label__icon"
                />
            </div>
        </div>
    )
}
