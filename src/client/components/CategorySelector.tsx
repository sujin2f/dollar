import React, { Fragment } from 'react'
import { useCategory, useGlobalOption, useOverlay } from 'src/client/hooks'
import { Column, Row, Button, Switch } from 'src/client/components'
import { splitItems } from 'src/utils'
import { Palette } from '../const/palette'

export const CategorySelector = (): JSX.Element => {
    const { categories, updateCategory } = useCategory()
    const { categorySelector } = useGlobalOption()
    const { closeModal, Overlay } = useOverlay()

    const items = splitItems(categories, 4)
    const cols = items.map((itemRow, index) => (
        <Column
            className="category-selector"
            small={3}
            key={`category-selector-itemRow-${index}`}
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
                                ? Palette.GREY
                                : category.color || Palette.PRIMARY,
                        }}
                    />
                    <input
                        type="color"
                        className="category-selector__color"
                        id={`category-selector-color-${category._id}`}
                        defaultValue={category.color || Palette.PRIMARY}
                        onChange={(e) => {
                            updateCategory({
                                variables: {
                                    category: {
                                        _id: category._id,
                                        color: e.target.value,
                                    },
                                },
                            })
                        }}
                    />
                    <label
                        htmlFor={`category-selector-color-${category._id}`}
                        className="category-selector__color__label"
                    >
                        {category.title}
                    </label>
                </div>
            ))}
        </Column>
    ))

    return (
        <Fragment>
            {categorySelector && (
                <Overlay className="category-selector__wrapper">
                    <Row>{cols}</Row>

                    <Row>
                        <Column>
                            <Button
                                className="secondary"
                                onClick={() => closeModal()}
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
