import React, { Fragment } from 'react'

import { useCategory, useGlobalOption, useOverlay } from 'src/client/hooks'
import { Column, Row, Button, Switch, Icon } from 'src/client/components'
import { splitItems } from 'src/utils/array'
import { BW } from 'src/constants/color'

export const CategorySelector = (): JSX.Element => {
    const { categories, updateCategory } = useCategory()
    const { categorySelectorOpened, openCategoryEditor, closeComponents } =
        useGlobalOption()
    const { Overlay } = useOverlay()

    const items = splitItems(categories, 4)
    const cols = items.map((itemRow, index) => (
        <Column
            className="category-selector"
            small={3}
            key={`category-selector-column-${index}`}
        >
            {itemRow.map((category) => (
                <div
                    key={`category-selector-${category._id}`}
                    className="category-selector__item"
                >
                    <Switch
                        id={`category-selector-${category._id}`}
                        checked={!category.disabled}
                        onChange={() => {
                            updateCategory({
                                variables: {
                                    category: {
                                        _id: category._id,
                                        disabled: !category.disabled,
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
            ))}
        </Column>
    ))

    return (
        <Fragment>
            {categorySelectorOpened && (
                <Overlay className="category-selector__wrapper">
                    <Row>{cols}</Row>

                    <Row>
                        <Column>
                            <Button
                                className="secondary"
                                onClick={() => closeComponents()}
                                title="Close"
                                autoFocus
                            />
                        </Column>
                    </Row>
                </Overlay>
            )}
        </Fragment>
    )
}
