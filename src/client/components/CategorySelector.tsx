import React, { Fragment } from 'react'

import { useCategory, useGlobalOption } from 'src/client/hooks'
import { splitItems } from 'src/utils/array'
import { Button } from 'src/common/components/forms/Button'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { Overlay } from 'src/common/components/containers/Overlay'
import { CategorySelectorItem } from 'src/client/components'

export const CategorySelector = (): JSX.Element => {
    const { getRootCategories } = useCategory()
    const { categorySelectorOpened, closeComponents } = useGlobalOption()

    const items = splitItems(getRootCategories(), 4)
    const cols = items.map((itemRow, index) => (
        <Column
            className="category-selector"
            small={3}
            key={`category-selector-column-${index}`}
        >
            {itemRow.map((category) => (
                <Fragment key={`category-selector-${category._id}`}>
                    <CategorySelectorItem category={category} />

                    {category.children &&
                        !category.disabled &&
                        category.children.map((child) => (
                            <CategorySelectorItem
                                key={`category-selector-${child._id}`}
                                category={child}
                                isChild
                            />
                        ))}
                </Fragment>
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
