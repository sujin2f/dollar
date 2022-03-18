import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { connect, close, clear } from 'src/jest/mongo'
import {
    updateCategory,
    getCategoryByString,
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
            let category = await getCategoryByString(userId, 'child')
            category.color = 'test'
            await updateCategory(
                {
                    category,
                },
                request,
            )
            category = await getCategoryByString(userId, 'child')
            expect(category.color).toEqual('test')
        })

        it('Update with Same info', async () => {
            let category = await getCategoryByString(userId, 'child')
            const color = category.color
            await updateCategory(
                {
                    category,
                },
                request,
            )
            category = await getCategoryByString(userId, 'child')
            expect(category.color).toEqual(color)
        })
    })

    describe('getCategories()', () => {
        it('Get Categories', async () => {
            await getCategoryByString(userId, 'bank')
            await getCategoryByString(userId, 'money')
            await getCategoryByString(userId, 'tax')
            await getCategoryByString(userId, 'note', 'bank')

            const categories = await getCategories(undefined, request)
            const hasChildren = categories.filter((cat) => cat.title === 'bank')
            expect(categories.length).toEqual(3)
            expect(hasChildren[0].children?.length).toBeTruthy()
        })
    })

    describe('getCategoryByString()', () => {
        it('One Category', async () => {
            const one = await getCategoryByString(userId, 'one')
            expect(one.title).toEqual('one')
        })

        it('One Existing Category', async () => {
            const one = await getCategoryByString(userId, 'one')
            const another = await getCategoryByString(userId, 'one')
            expect(one._id.toString()).toEqual(another._id.toString())
            expect(one.color).toEqual(another.color)
        })

        it('🤬 Child exist and parent not, throw', async () => {
            await getCategoryByString(userId, 'child')
            await getCategoryByString(userId, 'child', 'parent')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('🤬 Child and parent exist and relationship not, throw', async () => {
            await getCategoryByString(userId, 'child')
            await getCategoryByString(userId, 'parent')
            await getCategoryByString(userId, 'child', 'parent')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })

        it('Child and parent exist and relationship, return', async () => {
            await getCategoryByString(userId, 'parent')
            await getCategoryByString(userId, 'child', 'parent')
            const child = await getCategoryByString(userId, 'child', 'parent')
            const parent = await getCategoryByString(userId, 'parent')
            expect(child.parent?._id.toString()).toEqual(parent._id.toString())
            expect(
                parent.children && parent.children[0]._id.toString(),
            ).toEqual(child._id.toString())
        })

        it('Both do not exist', async () => {
            const child = await getCategoryByString(userId, 'child', 'parent')
            const parent = await getCategoryByString(userId, 'parent')
            expect(child.parent?._id.toString()).toEqual(parent._id.toString())
            expect(
                parent.children && parent.children[0]._id.toString(),
            ).toEqual(child._id.toString())
        })
    })

    describe.skip('Dummy', () => {
        it('🤬 Dummy', async () => {
            expect(true).toEqual(false)
        })
    })
})
