import React, { useState } from 'react'
import { useCategory } from 'src/client/hooks'
import { Column, Row } from 'src/client/components'
import { Button } from './form/Button'

export const CategorySelector = (): JSX.Element => {
    const [open, changeOpen] = useState<boolean>(false)
    const { categories, updateCategory } = useCategory()

    return (
        <header className="category-selector__wrapper">
            {!open && (
                <button onClick={() => changeOpen(!open)}>
                    Category-Selector
                </button>
            )}
            {open && (
                <Row>
                    <Column className="category-selector">
                        {categories.map((category) => (
                            <div
                                key={`category-selector-${category._id}`}
                                className="category-selector__item"
                            >
                                <input
                                    className="switch-input"
                                    id={`category-selector-${category._id}`}
                                    type="checkbox"
                                    checked={!category.disabled}
                                    onChange={() => {
                                        updateCategory({
                                            variables: {
                                                category: {
                                                    _id: category._id,
                                                    disabled:
                                                        !category.disabled,
                                                },
                                            },
                                        })
                                    }}
                                />
                                <label
                                    className="switch-paddle"
                                    htmlFor={`category-selector-${category._id}`}
                                >
                                    <span className="show-for-sr">
                                        <span className="hidden">
                                            Toggle {category.title}
                                        </span>
                                    </span>
                                </label>
                                {category.title}
                            </div>
                        ))}
                    </Column>

                    <Column className="category-selector">
                        <Button
                            className="secondary"
                            onClick={() => changeOpen(false)}
                            title="Close"
                        />
                    </Column>
                </Row>
            )}
        </header>
    )
}
