import React, { useState } from 'react'
import { useCategory } from '../hooks'

export const CategorySelector = (): JSX.Element => {
    const [open, changeOpen] = useState<boolean>(false)
    const { categories, toggleCategoryHidden } = useCategory()

    return (
        <header className="category-selector__wrapper">
            {!open && (
                <button onClick={() => changeOpen(!open)}>
                    Category-Selector
                </button>
            )}
            {open && (
                <div className="row">
                    <div className="columns small-12 category-selector">
                        {categories.map((category) => (
                            <div
                                key={`category-selector-${category._id}`}
                                className="category-selector__item"
                            >
                                <input
                                    className="switch-input"
                                    id={`category-selector-${category._id}`}
                                    type="checkbox"
                                    defaultChecked={!category.hide}
                                    onChange={() =>
                                        toggleCategoryHidden(category._id)
                                    }
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
                    </div>

                    <div className="columns small-12 category-selector">
                        <button
                            className="button secondary"
                            onClick={() => changeOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
