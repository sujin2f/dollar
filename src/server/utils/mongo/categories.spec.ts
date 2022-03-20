// yarn test categories.spec.ts

import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { connect, close, clear } from 'src/jest/mongo'
import {
    updateCategory,
    mustGetCategoryByString,
    getCategories,
} from './categories'

describe('category.ts', () => {
    const userId = new ObjectId().toString()
    const request = { session: { user: userId } } as Request

    beforeAll(async () => await connect())
    beforeEach(async () => await clear())
    afterAll(async () => await close())

    describe('updateCategory()', () => {
        it('🤬 Tries to update unknown', async () => {
            await updateCategory(
                {
                    category: {
                        _id: 'string',
                        title: 'string',
                        disabled: false,
                        color: 'string',
                    },
                },
                request,
            )
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('Update', async () => {
            let category = await mustGetCategoryByString(userId, 'category')
            category.color = 'test'
            await updateCategory(
                {
                    category,
                },
                request,
            )
            category = await mustGetCategoryByString(userId, 'category')
            expect(category.color).toEqual('test')
        })

        it('Update with Same info', async () => {
            let category = await mustGetCategoryByString(userId, 'category')
            const color = category.color
            await updateCategory(
                {
                    category,
                },
                request,
            )
            category = await mustGetCategoryByString(userId, 'category')
            expect(category.color).toEqual(color)
        })
    })

    describe('getCategories()', () => {
        it('Get Categories', async () => {
            await mustGetCategoryByString(userId, 'bank')
            await mustGetCategoryByString(userId, 'money')
            await mustGetCategoryByString(userId, 'tax')
            await mustGetCategoryByString(userId, 'bank', 'note')

            const categories = await getCategories(undefined, request)
            const hasChildren = categories.filter((cat) => cat.title === 'bank')
            expect(categories.length).toEqual(4)
            expect(hasChildren[0].children?.length).toBeTruthy()
        })

        it('Get Empty', async () => {
            const categories = await getCategories(undefined, request)
            expect(categories).toEqual([])
        })
    })

    describe('mustGetCategoryByString()', () => {
        it('One Category', async () => {
            const category = await mustGetCategoryByString(userId, 'category')
            expect(category.title).toEqual('category')
        })

        it('One Existing Category', async () => {
            const category = await mustGetCategoryByString(userId, 'category')
            const another = await mustGetCategoryByString(userId, 'category')
            expect(category._id.toString()).toEqual(another._id.toString())
            expect(category.color).toEqual(another.color)
        })

        it('🤬 Child exist and parent not, throw', async () => {
            await mustGetCategoryByString(userId, 'child')
            await mustGetCategoryByString(userId, 'parent', 'child')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('🤬 An item is already a parent, and tries to make it as a child, throw', async () => {
            await mustGetCategoryByString(userId, 'parentA', 'childA')
            await mustGetCategoryByString(userId, 'parentB', 'childB')
            await mustGetCategoryByString(userId, 'parentA', 'parentB')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('🤬 An item already has a parent, throw', async () => {
            await mustGetCategoryByString(userId, 'parent', 'child')
            await mustGetCategoryByString(userId, 'another', 'child')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('🤬 Child exist and relationship not, throw', async () => {
            await mustGetCategoryByString(userId, 'child')
            await mustGetCategoryByString(userId, 'parent')
            await mustGetCategoryByString(userId, 'parent', 'child')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('🤬 A parent already has a parent, throw', async () => {
            await mustGetCategoryByString(userId, 'ancestor')
            await mustGetCategoryByString(userId, 'ancestor', 'parent')
            await mustGetCategoryByString(userId, 'parent', 'child')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('Child and parent exist and relationship, return', async () => {
            await mustGetCategoryByString(userId, 'parent')
            await mustGetCategoryByString(userId, 'parent', 'child')
            const parent = await mustGetCategoryByString(userId, 'parent')
            const child = await mustGetCategoryByString(
                userId,
                'parent',
                'child',
            )

            expect(child.parent?.toString()).toEqual(parent._id.toString())
            expect(
                parent.children && parent.children[0]._id.toString(),
            ).toEqual(child._id.toString())
        })

        it('Both do not exist', async () => {
            const child = await mustGetCategoryByString(
                userId,
                'parent',
                'child',
            )
            const parent = await mustGetCategoryByString(userId, 'parent')
            expect(child.parent?.toString()).toEqual(parent._id.toString())
            expect(
                parent.children && parent.children[0]._id.toString(),
            ).toEqual(child._id.toString())
        })
    })
})
