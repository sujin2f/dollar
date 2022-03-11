import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTable,
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

            {type === TableType.Daily && (
                <Fragment>
                    <Row>
                        <Column>
                            <CategoryGraph />
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <AccountBookTable />
                        </Column>
                    </Row>
                </Fragment>
            )}
        </Fragment>
    )
}
