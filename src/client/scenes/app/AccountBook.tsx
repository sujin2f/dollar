import React, { Fragment } from 'react'
import {
    AccountBookHeader,
    AccountBookTable,
    AccountBookTypeSelector,
    CategoryGraph,
    Modal,
    DeleteItemModal,
    UpdateItemModal,
    Row,
    Column,
} from 'src/client/components'
import { useAccountBookMatch, useGlobalOption } from 'src/client/hooks'
import { TableType } from 'src/constants/accountBook'

export const AccountBook = (): JSX.Element => {
    const { type: typeMatch } = useAccountBookMatch()
    const { deleteModal, updateModal } = useGlobalOption()
    const type = typeMatch || TableType.Daily

    return (
        <Fragment>
            {/* Delete Modal */}
            {deleteModal && (
                <Modal>
                    <DeleteItemModal />
                </Modal>
            )}
            {/* Update Modal */}
            {updateModal && (
                <Modal>
                    <UpdateItemModal />
                </Modal>
            )}

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
