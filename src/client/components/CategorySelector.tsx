import React, { Fragment } from 'react'

import { useCategory, useGlobalOption } from 'src/client/hooks'
import { Icon } from 'src/client/components'
import { Switch } from 'src/common/components/forms/Switch'
import { splitItems } from 'src/utils/array'
import { BW } from 'src/constants/color'
import { Button } from 'src/common/components/forms/Button'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { Overlay } from 'src/common/components/containers/Overlay'

export const CategorySelector = (): JSX.Element => {
    const { categories, updateCategory } = useCategory()
    const { categorySelectorOpened, openCategoryEditor, closeComponents } =
        useGlobalOption()

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
            ))}
        </Column>
    ))

    return (
        <Fragment>
            {categorySelectorOpened && (
                <Overlay
                    className="category-selector__wrapper"
                    onClick={closeComponents}
                >
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
