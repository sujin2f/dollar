import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTableDaily,
    AccountBookTableMonthly,
    AccountBookTypeSelector,
    CategoryGraph,
    Row,
    Column,
} from 'src/client/components'
import { useAccountBookMatch } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'

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
        </Fragment>
    )
}
