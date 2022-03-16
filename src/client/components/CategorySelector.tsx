import React, { Fragment } from 'react'

import { useCategory, useGlobalOption, useOverlay } from 'src/client/hooks'
import { Column, Row, Button, Switch, ColorPicker } from 'src/client/components'
import { splitItems } from 'src/utils'
import { BW } from 'src/constants/color'

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
                                ? BW.GREY
                                : category.color || BW.BLACK,
                        }}
                    />
                    <ColorPicker
                        color={category.color || BW.BLACK}
                        onChange={(color) => {
                            updateCategory({
                                variables: {
                                    category: {
                                        _id: category._id,
                                        color,
                                    },
                                },
                            })
                        }}
                        label={category.title}
                    />
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
