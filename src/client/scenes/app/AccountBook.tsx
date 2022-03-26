import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTableDaily,
    AccountBookTableMonthly,
    AccountBookTypeSelector,
    CategoryGraph,
} from 'src/client/components'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

export const AccountBook = (): JSX.Element => {
    const { type: typeMatch } = useAccountBookMatch()
    const type = typeMatch || TableType.Daily

    return (
        <Fragment>
            <Row>
                <Column>
                    <AccountBookTypeSelector />
                </Column>
            </Row>

            <Row>
                <Column>
                    <AccountBookHeader />
                </Column>
            </Row>

            <Row>
                <Column>
                    <CategoryGraph />
                </Column>
            </Row>

            {type === TableType.Daily && (
                <Row>
                    <Column>
                        <AccountBookTableDaily />
                    </Column>
                </Row>
            )}
            {type === TableType.Monthly && (
                <Row>
                    <Column>
                        <AccountBookTableMonthly />
                    </Column>
                </Row>
            )}
            {type === TableType.Annual && (
                <Row>
                    <Column>
                        <AccountBookTableMonthly />
                    </Column>
                </Row>
            )}
        </Fragment>
    )
}
