// yarn test items.spec.ts

import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { connect, close, clear } from 'src/jest/mongo'

import { TableType } from 'src/constants/accountBook'
import { CategoryModel, mustGetCategoryByString } from './categories'
import { PreSelectModel } from './preSelect'
import { addItem, addItems, deleteItem, getItems, updateItem } from './items'
import { ItemsParam } from 'src/constants/graph-query'

describe('item.ts', () => {
    const userId = new ObjectId().toString()
    const request = { session: { user: userId } } as Request

    beforeAll(async () => await connect())
    beforeEach(async () => await clear())
    afterAll(async () => await close())

    describe('addItem()', () => {
        it('Add Item /w category', async () => {
            const redirection = await addItem(
                {
                    rawItem: {
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
            expect(redirection).toEqual('/app/daily/1977/1')
        })

        it('🤬 Add Item /w wrong parent-child category', async () => {
            await mustGetCategoryByString(userId, 'parent', 'child')
            await addItem(
                {
                    rawItem: {
                        _id: '',
                        checked: true,
                        date: '1977-01-02',
                        title: 'item',
                        originTitle: 'item',
                        debit: 10,
                        credit: 0,
                        category: 'child',
                        subCategory: 'parent',
                    },
                },
                request,
            )
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })
    })

    it('addItems()', async () => {
        const redirection = await addItems(
            {
                rawItems: [
                    {
                        checked: true,
                        date: '1977-01-02',
                        title: 'item',
                        originTitle: 'item first',
                        debit: 10,
                        credit: 0,
                        category: 'category',
                    },
                    {
                        checked: true,
                        date: '2082-01-02',
                        title: 'item',
                        originTitle: 'item second',
                        debit: 10,
                        credit: 0,
                        category: 'category',
                    },
                ],
            } as ItemsParam,
            request,
        )
        expect(redirection).toEqual('/app/daily/2082/1')

        // Check the pre-select goes well
        const preSelect = await PreSelectModel.findOne(
            {
                user: userId,
                $text: { $search: 'item' },
            },
            { score: { $meta: 'textScore' } },
        )
            .sort({ score: { $meta: 'textScore' } })
            .populate({ path: 'category', model: CategoryModel })

        expect(preSelect?.title).toEqual('item first second')
        expect(preSelect?.category?.title).toEqual('category')
    })

    describe('getItems()', () => {
        beforeEach(async () => {
            await addItems(
                {
                    rawItems: [
                        {
                            checked: true,
                            date: '1977-01-02',
                            title: 'item',
                            originTitle: 'item first',
                            debit: 10,
                            credit: 0,
                        },
                        {
                            checked: true,
                            date: '1977-01-03',
                            title: 'item',
                            originTitle: 'item second',
                            debit: 10,
                            credit: 0,
                        },
                        {
                            checked: true,
                            date: '1977-01-04',
                            title: 'item',
                            originTitle: 'item second',
                            debit: 10,
                            credit: 0,
                        },
                        {
                            checked: true,
                            date: '1977-02-02',
                            title: 'item',
                            originTitle: 'item second',
                            debit: 10,
                            credit: 0,
                        },
                        {
                            checked: true,
                            date: '1978-02-02',
                            title: 'item',
                            originTitle: 'item second',
                            debit: 10,
                            credit: 0,
                        },
                    ],
                } as ItemsParam,
                request,
            )
        })

        it('Daily', async () => {
            const items = await getItems(
                { year: 1977, month: 1, type: TableType.Daily } as ItemsParam,
                request,
            )

            expect(items.length).toEqual(3)
        })

        it('Monthly', async () => {
            const items = await getItems(
                { year: 1977, month: 1, type: TableType.Monthly } as ItemsParam,
                request,
            )

            expect(items.length).toEqual(2)
            expect(items[0].debit).toEqual(30)
            expect(items[0].date).toEqual('1977-01')
            expect(items[1].debit).toEqual(10)
            expect(items[1].date).toEqual('1977-02')
        })

        it('Annual', async () => {
            const items = await getItems(
                { year: 1977, month: 1, type: TableType.Annual } as ItemsParam,
                request,
            )

            expect(items.length).toEqual(2)
            expect(items[0].debit).toEqual(40)
            expect(items[0].date).toEqual('1977')
            expect(items[1].debit).toEqual(10)
            expect(items[1].date).toEqual('1978')
        })
    })

    it('deleteItem()', async () => {
        const rawItem = {
            _id: '',
            checked: true,
            date: '1977-01-02',
            title: 'item',
            originTitle: 'item',
            debit: 10,
            credit: 0,
            category: 'category',
        }
        await addItem(
            {
                rawItem,
            },
            request,
        )
        let items = await getItems(
            { year: 1977, month: 1, type: TableType.Daily } as ItemsParam,
            request,
        )
        const del = await deleteItem(
            { rawItem: { ...rawItem, _id: items[0]._id } },
            request,
        )
        items = await getItems(
            { year: 1977, month: 1, type: TableType.Daily } as ItemsParam,
            request,
        )

        expect(items.length).toBeFalsy()
        expect(del).toBeTruthy()
    })

    it('updateItem()', async () => {
        const rawItem = {
            checked: true,
            date: '1977-01-02',
            title: 'item',
            originTitle: 'item',
            debit: 10,
            credit: 0,
            category: 'category',
        }
        await addItem(
            {
                rawItem,
            },
            request,
        )
        let items = await getItems(
            { year: 1977, month: 1, type: TableType.Daily } as ItemsParam,
            request,
        )
        const update = await updateItem(
            {
                rawItem: {
                    ...rawItem,
                    _id: items[0]._id,
                    date: '1977-01-03',
                    title: 'item 2',
                    originTitle: 'item',
                    debit: 100,
                },
            },
            request,
        )
        items = await getItems(
            { year: 1977, month: 1, type: TableType.Daily } as ItemsParam,
            request,
        )

        expect(items[0].date).toEqual('1977-01-03')
        expect(items[0].title).toEqual('item 2')
        expect(update).toBeTruthy()
    })
})
