// yarn test preSelect.spec.ts

import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { connect, close, clear } from 'src/jest/mongo'
import { RawItem } from 'src/types/model'
import { addItem, addItems } from './items'
import { getRawItems } from './preSelect'

describe('category.ts', () => {
    const userId = new ObjectId().toString()
    const request = { session: { user: userId } } as Request

    beforeAll(async () => await connect())
    beforeEach(async () => await clear())
    afterAll(async () => await close())

    describe('getRawItems()', () => {
        it('Uncheck duplication', async () => {
            await addItem(
                {
                    item: {
                        checked: true,
                        date: '1977-01-02',
                        title: 'item',
                        originTitle: 'item',
                        debit: 10,
                        credit: 0,
                        category: 'category',
                    },
                },
                request,
            )
            const items = await getRawItems(
                {
                    rawItems: [
                        {
                            checked: true,
                            date: '1977-01-02',
                            originTitle: 'item',
                            debit: 10,
                        } as RawItem,
                    ],
                },
                request,
            )

            expect(items[0].checked).toBeFalsy()
        })

        it('Select category', async () => {
            await addItems(
                {
                    items: [
                        {
                            checked: true,
                            date: '1977-01-02',
                            title: 'item',
                            originTitle: 'item test',
                            debit: 10,
                            credit: 0,
                            category: 'category',
                        },
                    ],
                },
                request,
            )
            const items = await getRawItems(
                {
                    rawItems: [
                        {
                            checked: true,
                            date: '1977-01-02',
                            originTitle: 'test',
                            debit: 10,
                        } as RawItem,
                    ],
                },
                request,
            )

            expect(items[0].checked).toBeTruthy()
            expect(items[0].category).toMatch('category')
        })
    })
})
