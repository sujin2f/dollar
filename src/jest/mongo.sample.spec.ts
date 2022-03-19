// yarn test items.spec.ts

import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { connect, close, clear } from 'src/jest/mongo'

describe('file-name.ts', () => {
    const userId = new ObjectId().toString()
    const request = { session: { user: userId } } as Request

    beforeAll(async () => await connect())
    beforeEach(async () => await clear())
    afterAll(async () => await close())

    describe.skip('Dummy', () => {
        it('🤬 Dummy', async () => {
            expect(true).toEqual(false)
        })
    })
})
